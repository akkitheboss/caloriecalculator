const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

const GOAL_ADJUSTMENT = {
  maintain: 0,
  cut: -500,
  bulk: 300,
};

const form = document.getElementById("calorie-form");
const errorEl = document.getElementById("error");
const resultsEl = document.getElementById("results");

function toKg(weight, unit) {
  return unit === "lb" ? weight * 0.45359237 : weight;
}

function toCm(height, unit) {
  return unit === "in" ? height * 2.54 : height;
}

function calculateBMR({ sex, age, weightKg, heightCm }) {
  if (sex === "male") {
    return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  }
  return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
}

function validate({ sex, age, weight, height, activity }) {
  if (!sex || !activity) return "Please choose sex and activity level.";
  if (!Number.isFinite(age) || age < 10 || age > 100) return "Age must be between 10 and 100.";
  if (!Number.isFinite(weight) || weight <= 0) return "Weight must be a positive number.";
  if (!Number.isFinite(height) || height <= 0) return "Height must be a positive number.";
  return "";
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  errorEl.textContent = "";

  const sex = document.getElementById("sex").value;
  const age = Number(document.getElementById("age").value);
  const weight = Number(document.getElementById("weight").value);
  const weightUnit = document.getElementById("weight-unit").value;
  const height = Number(document.getElementById("height").value);
  const heightUnit = document.getElementById("height-unit").value;
  const activity = document.getElementById("activity").value;
  const goal = document.getElementById("goal").value;

  const message = validate({ sex, age, weight, height, activity });
  if (message) {
    resultsEl.classList.add("hidden");
    errorEl.textContent = message;
    return;
  }

  const weightKg = toKg(weight, weightUnit);
  const heightCm = toCm(height, heightUnit);

  const bmr = calculateBMR({ sex, age, weightKg, heightCm });
  const tdee = bmr * ACTIVITY_MULTIPLIERS[activity];
  const goalCalories = tdee + GOAL_ADJUSTMENT[goal];

  document.getElementById("bmr-value").textContent = Math.round(bmr).toString();
  document.getElementById("tdee-value").textContent = Math.round(tdee).toString();
  document.getElementById("goal-value").textContent = Math.round(goalCalories).toString();

  resultsEl.classList.remove("hidden");
});
