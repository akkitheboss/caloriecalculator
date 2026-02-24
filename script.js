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
const submitButton = document.getElementById("submit-btn");
const gateMessage = document.getElementById("gate-message");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");

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

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validate({ name, email, sex, age, weight, height, activity }) {
  if (!name || name.trim().length < 2) return "Please enter your full name.";
  if (!isValidEmail(email)) return "Please enter a valid email address.";
  if (!sex || !activity) return "Please choose sex and activity level.";
  if (!Number.isFinite(age) || age < 10 || age > 100) return "Age must be between 10 and 100.";
  if (!Number.isFinite(weight) || weight <= 0) return "Weight must be a positive number.";
  if (!Number.isFinite(height) || height <= 0) return "Height must be a positive number.";
  return "";
}

function updateGateState() {
  const ready = nameInput.value.trim().length >= 2 && isValidEmail(emailInput.value.trim());
  submitButton.disabled = !ready;
  gateMessage.textContent = ready
    ? "Contact details captured. You can now submit to view results."
    : "Please fill name + valid email to enable submission.";
}

async function saveLead(payload) {
  const response = await fetch("/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Could not save your details. Please try again.");
  }
}

nameInput.addEventListener("input", updateGateState);
emailInput.addEventListener("input", updateGateState);
updateGateState();

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  errorEl.textContent = "";
  resultsEl.classList.add("hidden");

  const name = nameInput.value;
  const email = emailInput.value;
  const sex = document.getElementById("sex").value;
  const age = Number(document.getElementById("age").value);
  const weight = Number(document.getElementById("weight").value);
  const weightUnit = document.getElementById("weight-unit").value;
  const height = Number(document.getElementById("height").value);
  const heightUnit = document.getElementById("height-unit").value;
  const activity = document.getElementById("activity").value;
  const goal = document.getElementById("goal").value;

  const message = validate({ name, email, sex, age, weight, height, activity });
  if (message) {
    errorEl.textContent = message;
    return;
  }

  const weightKg = toKg(weight, weightUnit);
  const heightCm = toCm(height, heightUnit);

  const bmr = calculateBMR({ sex, age, weightKg, heightCm });
  const tdee = bmr * ACTIVITY_MULTIPLIERS[activity];
  const goalCalories = tdee + GOAL_ADJUSTMENT[goal];

  submitButton.disabled = true;
  submitButton.textContent = "Saving...";

  try {
    await saveLead({
      name,
      email,
      sex,
      age,
      weightKg,
      heightCm,
      activity,
      goal,
      bmr,
      tdee,
      goalCalories,
    });
  } catch (error) {
    errorEl.textContent = error.message;
    submitButton.textContent = "Submit & See Results";
    updateGateState();
    return;
  }

  document.getElementById("bmr-value").textContent = Math.round(bmr).toString();
  document.getElementById("tdee-value").textContent = Math.round(tdee).toString();
  document.getElementById("goal-value").textContent = Math.round(goalCalories).toString();

  submitButton.textContent = "Submit & See Results";
  updateGateState();
  resultsEl.classList.remove("hidden");
});
