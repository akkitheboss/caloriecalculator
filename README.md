# Daily Calorie Calculator

Simple web-based calculator for estimating daily calorie requirements using the Mifflin-St Jeor formula.

## Features
- Inputs for sex, age, weight, height, activity level, and goal.
- Supports weight units (`kg`, `lb`) and height units (`cm`, `in`).
- Shows:
  - **BMR** (Basal Metabolic Rate)
  - **Maintenance calories (TDEE)**
  - **Goal-adjusted target calories**

## Run locally
Because this is a static website, serve it with any local file server.

### Option A: Python
```bash
python3 -m http.server 4173
```
Then open `http://localhost:4173`.

## Deploy to Vercel
1. Push this repository to GitHub.
2. In Vercel, create a new project and import the repository.
3. Use default settings (no build command needed for this static site).
4. Click **Deploy**.

Or with the Vercel CLI:
```bash
npm i -g vercel
vercel
vercel --prod
```
