# Daily Calorie Calculator

Web-based calorie calculator that estimates daily calorie requirements using the Mifflin-St Jeor formula.

## Features
- Inputs for **name**, **email**, sex, age, weight, height, activity level, and goal.
- Results are shown **only after name/email are submitted successfully**.
- Supports weight units (`kg`, `lb`) and height units (`cm`, `in`).
- Stores lead + calculation data in a **Neon Postgres** database through a Vercel API route.

## Local run
```bash
python3 -m http.server 4173
```
Then open `http://localhost:4173`.

> Note: `/api/lead` is a Vercel Serverless Function. It won't run with plain `python3 -m http.server`.

## Deploy to Vercel with Neon DB
1. Create a Neon project and copy the connection string.
2. Push this repository to GitHub.
3. In Vercel, create a new project and import the repo.
4. In **Project Settings → Environment Variables**, add:
   - `DATABASE_URL=<your_neon_connection_string>`
5. Deploy.

On first submission, the API auto-creates table `calculator_leads` if it does not already exist.

## API route
- `POST /api/lead`
- Required fields: `name`, `email`
- Persists contact and calculator data to Neon.

## Neon DB connection
Use the Neon Postgres connection string as the `DATABASE_URL` environment variable.

For local shell testing:
```bash
export DATABASE_URL="postgresql://neondb_owner:npg_yDNp7Udn6KWA@ep-soft-wave-a1xtucrl-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

For Vercel: add the same value in **Project Settings → Environment Variables** as `DATABASE_URL`.
