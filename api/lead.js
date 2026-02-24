import { neon } from "@neondatabase/serverless";

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, sex, age, weightKg, heightCm, activity, goal, bmr, tdee, goalCalories } = req.body ?? {};

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required." });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: "Please provide a valid email address." });
  }

  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ error: "DATABASE_URL is not configured." });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);

    await sql`
      CREATE TABLE IF NOT EXISTS calculator_leads (
        id BIGSERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        sex TEXT,
        age INTEGER,
        weight_kg DOUBLE PRECISION,
        height_cm DOUBLE PRECISION,
        activity TEXT,
        goal TEXT,
        bmr DOUBLE PRECISION,
        tdee DOUBLE PRECISION,
        goal_calories DOUBLE PRECISION,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await sql`
      INSERT INTO calculator_leads
        (name, email, sex, age, weight_kg, height_cm, activity, goal, bmr, tdee, goal_calories)
      VALUES
        (${name.trim()}, ${email.trim().toLowerCase()}, ${sex}, ${age}, ${weightKg}, ${heightCm}, ${activity}, ${goal}, ${bmr}, ${tdee}, ${goalCalories});
    `;

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: "Failed to save lead.", details: error.message });
  }
}
