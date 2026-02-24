#!/usr/bin/env python3
"""Daily calorie requirement calculator using Mifflin-St Jeor + activity multiplier."""

from dataclasses import dataclass


ACTIVITY_MULTIPLIERS = {
    "sedentary": 1.2,
    "light": 1.375,
    "moderate": 1.55,
    "active": 1.725,
    "very_active": 1.9,
}


@dataclass
class ClientProfile:
    sex: str
    age: int
    weight_kg: float
    height_cm: float
    activity_level: str


def calculate_bmr(profile: ClientProfile) -> float:
    sex = profile.sex.lower().strip()
    if sex == "male":
        return 10 * profile.weight_kg + 6.25 * profile.height_cm - 5 * profile.age + 5
    if sex == "female":
        return 10 * profile.weight_kg + 6.25 * profile.height_cm - 5 * profile.age - 161
    raise ValueError("sex must be 'male' or 'female'")


def calculate_daily_calories(profile: ClientProfile) -> float:
    activity = profile.activity_level.lower().strip()
    if activity not in ACTIVITY_MULTIPLIERS:
        valid = ", ".join(ACTIVITY_MULTIPLIERS)
        raise ValueError(f"activity_level must be one of: {valid}")
    bmr = calculate_bmr(profile)
    return bmr * ACTIVITY_MULTIPLIERS[activity]


def prompt_float(label: str, min_value: float) -> float:
    while True:
        raw = input(label).strip()
        try:
            value = float(raw)
            if value <= min_value:
                print(f"Please enter a value greater than {min_value}.")
                continue
            return value
        except ValueError:
            print("Please enter a valid number.")


def prompt_int(label: str, min_value: int) -> int:
    while True:
        raw = input(label).strip()
        try:
            value = int(raw)
            if value <= min_value:
                print(f"Please enter an integer greater than {min_value}.")
                continue
            return value
        except ValueError:
            print("Please enter a valid integer.")


def prompt_choice(label: str, valid_choices: set[str]) -> str:
    while True:
        value = input(label).strip().lower()
        if value in valid_choices:
            return value
        print(f"Please enter one of: {', '.join(sorted(valid_choices))}")


def main() -> None:
    print("=== Daily Calorie Requirement Calculator ===")
    print("Activity levels: sedentary, light, moderate, active, very_active")

    sex = prompt_choice("Sex (male/female): ", {"male", "female"})
    age = prompt_int("Age (years): ", 0)
    weight_kg = prompt_float("Weight (kg): ", 0)
    height_cm = prompt_float("Height (cm): ", 0)
    activity_level = prompt_choice(
        "Activity level: ", set(ACTIVITY_MULTIPLIERS.keys())
    )

    profile = ClientProfile(
        sex=sex,
        age=age,
        weight_kg=weight_kg,
        height_cm=height_cm,
        activity_level=activity_level,
    )

    bmr = calculate_bmr(profile)
    daily_calories = calculate_daily_calories(profile)

    print("\n--- Results ---")
    print(f"BMR: {bmr:.0f} kcal/day")
    print(f"Estimated daily calories (maintenance): {daily_calories:.0f} kcal/day")


if __name__ == "__main__":
    main()
