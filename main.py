from fastapi import FastAPI
import openai, time, logging, os
from openai import OpenAI
from mangum import Mangum
from supabase import create_client, Client


app = FastAPI()
handler = Mangum(app)

#Supabase Client init
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

#Open AI Client init
openai.api_key=os.environ.get('OPENAI_API_KEY')
client = OpenAI(api_key=openai.api_key)

#Function for function calling
# NOTE should be in seperate dir
def get_jobs():
    response = supabase.table('jobs').select("*").execute()
    return response

@app.get("/insert")
def store_thread(wa_id: str, wa_username: str, thread_id: str):
    '''
    Stores a new conversation thread in the database.

    This function is responsible for creating a record in the 'threads' table each time a new conversation thread is initiated with a user. It's an essential part of managing and tracking ongoing conversations in the application, ensuring that each message is correctly associated with its corresponding user and conversation thread.

    Parameters:
    - wa_id (str): The WhatsApp ID of the user, serving as a unique identifier for the conversation.
    - wa_username (str): The username of the user on WhatsApp. This is used for identification and possibly for personalized responses.
    - thread_id (str): The unique identifier of the newly created conversation thread.

    Returns:
    - response: The response from the database after attempting to insert the new thread. This includes details of the operation's success or failure and is useful for debugging and logging.

    The function inserts a new record into the 'threads' table with the provided WhatsApp ID, username, and thread ID. This operation is crucial for linking incoming and outgoing messages to the correct user and conversation context, enabling a coherent and continuous chat experience.
    '''
    response = supabase.table('threads').insert({"wa_id": wa_id, "wa_username": wa_username, "thread_id": thread_id}).execute()
    return response


@app.get("/get_thread")
def check_if_thread_exists(wa_id):
    '''
    Checks if a conversation thread associated with a given WhatsApp ID exists in the database.

    This function queries the 'threads' table in the database to find an entry matching the provided WhatsApp ID. It is designed to facilitate the retrieval of a thread ID for an ongoing conversation, which is critical for maintaining continuity in interactions with users.

    Parameters:
    - wa_id (str): The WhatsApp ID of the user for whom the thread is being checked.

    Returns:
    - thread_id (str or None): The ID of the existing thread if found; otherwise, None. This helps in determining whether to continue with an existing thread or start a new conversation.

    The function performs a SELECT query on the 'threads' table, filtering records by the 'wa_id' column. If a matching record is found, the corresponding 'thread_id' is returned. If no record exists for the given WhatsApp ID, the function returns None, indicating that a new thread needs to be created for this user.
    '''
    response = supabase.table('threads').select('wa_id, thread_id').eq('wa_id', wa_id).execute()
    
    if response.data and response.data[0].get('thread_id'):
        thread_id = response.data[0].get('thread_id')
    else:
        thread_id = None
    return thread_id

@app.get("/")
def read_root(wa_id: str, wa_username: str, message_body: str):
    '''
    Handles incoming WhatsApp messages and processes them through a chatbot assistant.

    This function manages conversation threads with users based on their WhatsApp ID. It checks for an existing thread and creates a new one if none is found. Once a thread is established, the user's message is added to it. The function then retrieves a predefined assistant and initiates a 'run' with the assistant to process the message.

    During the run, the function waits for the assistant to complete its processing. If the assistant requires additional actions (e.g., fetching job listings), it calls the appropriate functions and submits their outputs. The final processed message from the assistant is then returned.

    Parameters:
    - wa_id (str): The WhatsApp ID of the user.
    - wa_username (str): The username of the user on WhatsApp.
    - message_body (str): The content of the incoming message from the user.

    Returns:
    - new_message (str): The response generated by the assistant, based on the user's message.
    '''

    # match to the thread
    thread_id = check_if_thread_exists(wa_id)

    if thread_id is None:
        logging.info(f"Creating new thread for {wa_username} wa_id {wa_id}")
        thread = client.beta.threads.create()
        store_thread(wa_id,wa_username,thread.id)
        thread_id = thread.id
    else:
        logging.info(f"Retrieving existing thread for {wa_username} with wa_id {wa_id}")
        thread = client.beta.threads.retrieve(thread_id)

    logging.info(thread)
    # create the user's message
    message = client.beta.threads.messages.create(
        thread_id=thread_id,
        role="user",
        content=message_body,
    )

    # Retrieve the Assistant
    assistant = client.beta.assistants.retrieve("asst_bJkgsJpXkMFYLT30N2TEST8r")

    # Run the assistant
    run = client.beta.threads.runs.create(
        thread_id=thread.id,
        assistant_id=assistant.id,
    )
    
    while True:
        run = client.beta.threads.runs.retrieve(thread_id=thread.id, run_id=run.id)
        logging.info(f"Run is being initiated {run.id}")
        # Wait for completion
        if run.status == "completed":
            # Retrieve the Messages
            messages = client.beta.threads.messages.list(thread_id=thread.id)
            new_message = messages.data[0].content[0].text.value
            logging.info(f"Generated message: {new_message}")
            break

        elif run.status == "requires_action":
            logging.info(f"Function Calling")
            required_actions = run.required_action.submit_tool_outputs.model_dump()
            logging.info(required_actions)
            tool_outputs = []
            import json
            for action in required_actions["tool_calls"]:
                func_name = action['function']['name']
                arguments = json.loads(action['function']['arguments'])

                if func_name == "get_jobs":
                    print("attempting get current jobs")
                    output = get_jobs(location=arguments['location'])
                    tool_outputs.append({
                        "tool_call_id": action['id'],
                        "output": output
                    })
                else:
                    raise ValueError(f"Unknown function: {func_name}")

            logging.info("Submitting outputs back to the Assistant...")
            client.beta.threads.runs.submit_tool_outputs(
                thread_id=thread.id,
                run_id=run.id,
                tool_outputs=tool_outputs
            )
        else:
            logging.info("Waiting for the Assistant to process...")
            time.sleep(2)
    return new_message

def get_jobs(location):
    """
    checks for jobs in the db
    """
    response = supabase.table('jobs').select('*').execute()
    logging.info(f"The following jobs were found {response}")
    return f"the jobs available are {response}"

@app.get("/create")
def create_assistant():
    '''
    Creates and configures a new instance of the Robodolph assistant.

    This function sets up Robodolph, a chatbot assistant with a specific theme and set of instructions, using an AI model. Robodolph is tailored to assist users, especially students, in finding seasonal jobs and tasks. The configuration includes detailed instructions that define the chatbot's personality, response style, and functional capabilities.

    No Parameters: The function does not require any external parameters as it is designed to create a predefined assistant.

    Returns:
    - assistant: The created assistant instance with its configuration. This includes the assistant's name, its instructional script, the AI model it uses, and the tools (functions) it has access to for performing specific tasks (like fetching job listings).

    The assistant is configured with a friendly, holiday-themed personality and is programmed to provide concise, informative responses within a 1400 character limit. It is equipped with tools like 'get_jobs', enabling it to interact with a database to fetch job listings based on user queries. The assistant's setup ensures that it can handle location-based job searches and answer FAQs about job hunting and safe practices, all while maintaining user privacy and avoiding overly complex or opinionated responses.

    This setup is crucial for creating a user-friendly and efficient chatbot that can assist users in a targeted and engaging manner, making it an invaluable tool for users seeking job opportunities.
    '''
    assistant = client.beta.assistants.create(
    name="Robodolph",
    instructions="Robodolph is a friendly, reindeer-themed chatbot designed to assist students in finding odd jobs and tasks during the holiday season to earn extra money. The chatbot delivers concise and informative responses in a single message, strictly adhering to a 1400 character limit. Embodying a light-hearted, holiday, and reindeer-themed tone, Robodolph maintains professionalism while providing up-to-date job listings, location-based searches, and essential job details like task description, payment, location, and contact information. Additionally, it answers FAQs about job hunting and safe practices. Robodolph avoids complex explanations, personal opinions, and lengthy conversations, focusing on direct assistance while ensuring user privacy. For instance, in response to a query for a part-time job in Munich, Robodolph might reply: Hoof-tastic day! 🦌 In Munich, there's a need for a Gift Wrapping Assistant at MerryMart, starting Dec 15, pays €50/day. Email merrywrap@jobelf.com. Also, Snow Clearing near Central Park, flexible hours, €15/hour, contact snowclearer@winterhelp.com. Stay frosty and safe! ❄️",
    model="gpt-3.5-turbo-1106",
    tools=
    [
    {
        "type": "function",
        "function": {
          "name": "get_jobs",
          "description": "Checks for jobs in the database",
          "parameters": {
            "type": "object",
            "properties": {
                "location": {"type": "string", "description": "The place of where the jobs are locations"},
            },
            "required": ["location"]
          }
        }
    }
    ]
    )
    return assistant


@app.get("/get_jobs")
def get_jobs_in_db():
    '''
    Retrieves a list of available jobs from the database.

    This function queries the 'jobs' table in the database to fetch all records of available job listings. It serves as a key component in providing users with up-to-date information about job opportunities, making the process of job searching more efficient and user-friendly.

    No Parameters are required as the function is designed to fetch all job listings without any specific filtering.

    Returns:
    - response: The response from the database containing a list of job records. Each record typically includes details such as job title, description, payment, location, and other relevant information. The response is instrumental in offering users a comprehensive view of the job market and available opportunities.

    The function performs a SELECT query on the 'jobs' table without any filters, aiming to retrieve all entries. This broad approach is useful for applications where users prefer to browse through a complete list of jobs or where subsequent filtering is handled at a different stage of the application.
    '''
    response = supabase.table('jobs').select('*').execute()
    return response