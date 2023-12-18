# Robodolph: A Holiday Odd Jobs AI Chatbot
## Overview
Robodolph is a GPT-3 powered chatbot designed to assist students in finding odd jobs and tasks during the holiday season. Developed as part of the Serverless Guru 2023 Hackathon, Robodolph aims to match the supply and demand of labor during the busy holiday period, benefiting both students looking for work and households or businesses in need of temporary help.

## Features
WhatsApp Integration: Utilizes WhatsApp for easy and widespread access, especially in South Africa where the app is popular across a broad range of tech users.
AI-Powered Responses: Leveraging OpenAI's GPT-3 model to generate concise, informative, and engaging responses.
Job Matching: Helps vacationing students discover and engage with available tasks and jobs in their area.
Web App Interface: Allows businesses and households to create tasks and job openings.
Architecture
Robodolph operates through a custom API built with FastAPI and deployed on AWS Lambda. It integrates with Twilio’s WhatsApp sandbox, OpenAI assistants, and a Supabase Postgres DB for data persistence.

## Usage
For Students: Students can interact with Robodolph via WhatsApp to find available jobs in their vicinity.
For Businesses/Households: They can use the web app to post job openings and tasks.
## Development
Why WhatsApp?: Chosen for its widespread use and low data requirements, making it ideal for a region with diverse tech accessibility.
Key Algorithms: Includes a cyclical API response flow for efficient and continuous user interaction.
## Next Steps
Addressing current shortfalls like full deployment of the web app and comprehensive testing.
Enhancing performance and implementing asynchronous calls and Pydantic data validation.
## Acknowledgements
A huge thanks to everyone involved in this learning journey, especially the Serverless Guru team and the event organizers. Your support and guidance have been instrumental in bringing this project to life
