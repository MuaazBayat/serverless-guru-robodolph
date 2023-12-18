![141412118_padded_logo](https://github.com/nineteen58/next-js-dashboard-template/assets/144200809/d3ff64f5-bf29-47f7-8fce-90e20630b1f8)


<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#clone-and-run-locally"><strong>Clone and run locally</strong></a> ·
</p>
<br/>

## Features

- Works across the entire [Next.js](https://nextjs.org) stack
  - App Router
  - Pages Router
  - Middleware
  - Client
  - Server
  - It just works!
  - Tremor dash layouts
- supabase-ssr. A package to configure Supabase Auth to use cookies
- Styling with [Tailwind CSS](https://tailwindcss.com)
- Optional deployment with [Supabase Vercel Integration and Vercel deploy](#deploy-your-own)
  - Environment variables automatically assigned to Vercel project


## Clone and run locally

1. You'll first need a Supabase project which can be made [via the Supabase dashboard](https://database.new)

2. Clone the Repo
   ```
   git clone https://github.com/nineteen58/sebenzo_sa/
   ```
3. Enter the project directory
   
4. Create the file `.env.local` and update the following:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   ```

   Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found in [your Supabase project's API settings](https://app.supabase.com/project/_/settings/api)
  > [!NOTE]
  > Request this file from the administrators
5. Install dependencies and packages
   ```
   npm install
   ```
6. You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```

   The project should now be running on [localhost:3000](http://localhost:3000/).

