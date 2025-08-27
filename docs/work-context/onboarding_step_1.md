# Onboarding — Step 1 (Personal Info, Units & Baseline)

This document specifies **Step 1** of onboarding. It covers the **UI**, **localStorage**, and the exact **backend mapping on final submit**. Designed to be implemented with **Bootstrap 5** and your brand colors (teal/orange).

---

## General rules (for the whole onboarding)

- **Persist at end only:** each step writes to **localStorage**; the app sends **one request** on the final Step 7 Submit.
- **One transaction on submit (backend):** close current assessment + insert new; **upsert** profile/preferences; **bulk insert** injuries/goals (and measurements if present); return created IDs.
- **IDs:** the **backend** generates 64-hex **TEXT** IDs for new rows (injuries, goals, messages, etc.).
- **Units:** UI accepts metric/imperial; **convert to canonical** (meters, kilograms) on the **backend** at submit.
- **Timezone/language:** populated at registration - don't show here.

---

## Step 1 — Frontend spec

### Title & helper text

- **Title:** `Personal info`
- **Subtitle:** `We’ll use this to tailor training targets and track progress. You can change it later.`

### Fields

1. **Units toggle** *(required)*
   - Options: `Metric` / `Imperial`
   - This sets the user’s **preferred unit system** to save to the profile on submit.
2. **Height (optional)**
   - Metric: `Height (cm)` numeric input
   - Imperial: `Height (ft)` + `Height (in)` numeric inputs
3. **Weight (optional baseline)**
   - Metric: `Weight (kg)` numeric input
   - Imperial: `Weight (lb)` numeric input
4. **Date of birth** *(required)*
   - Date (range `1930..(currentYear-7)`).
5. **Gender** *(required)*
   - Radio: `Male / Female / Prefer not to say`
6. **Activity level** *(required)*
   - Radio (single select):
     - `Sedentary` — little to no exercise
     - `Light` — light exercise / some walking
     - `Moderate` — moderate exercise or active job
     - `High` — hard exercise or physical job
     - `Extreme` — very intense training or highly physical job

### Validation

- **Year of birth:** integer; min 1930; max `currentYear - 8`.
- **Gender:** required.
- **Activity level:** required.
- **Height:** optional; if provided, must be positive (> 0).
- **Weight:** optional; if provided, must be positive (> 0).

### Local storage

- **Key:** `onboarding/step1/v1/<userId>`
- **Slice saved by Step 1:**

```json
{
  "personal": {
    "unitSystem": "metric",           // "metric" | "imperial" (from toggle)
    "dateOfBirth": 1991-02-05,
    "gender": "female",               // "male" | "female" | "na"
    "activityLevel": "moderate",      // sedentary|light|moderate|high|extreme

    // raw user input + units (so we can re-render exactly what they typed)
    "heightRaw": 168,                   // number or null (cm or inches depending on heightUnit)
    "heightUnit": "cm",               // "cm" | "in" | "ft_in" (UI supports cm OR ft+in)
    "heightFtRaw": 5,                   // only when heightUnit === "ft_in"
    "heightInRaw": 11,                  // only when heightUnit === "ft_in"

    "weightRaw": 67.5,                  // number or null
    "weightUnit": "kg",               // "kg" | "lb"

    // read-only context from profile — can also be stored here for summary display
    "timezone": "Europe/Ljubljana",
    "language": "en"
  }
}
```

- **When saved:** on **Next** (after Zod validation). No network calls yet.

### UI framework & branding

- **Bootstrap 5** classes (`container`, `card`, `form-control`, `btn`, `btn-group`, etc.).
- **Brand colors:** set global CSS variables (BS 5.3):
  ```css
  :root {
    --bs-primary: #0e7490;      /* teal — replace with your exact hex */
    --bs-primary-rgb: 14,116,144;
    --bs-warning: #ea580c;      /* orange — replace with your exact hex */
    --bs-warning-rgb: 234,88,12;
  }
  ```
- Accessibility: associate `<label>` with inputs (`for`/`id`), group radios properly, use `aria-pressed` for custom toggles if needed.

### Minimal component checklist

- `ui/src/features/onboarding/steps/Step1Personal.tsx` — renders inputs, handles toggle, performs validation, saves slice.
- `ui/src/features/onboarding/validation.ts` — `Step1Schema` (Zod) for the fields above.
- `ui/src/features/onboarding/store.ts` — get/merge/save to localStorage key.

**Yup (example):**

```ts
export const Step1Schema = yup.object({
  unitSystem: yup.string().oneOf(['metric','imperial']).required(),
  dateOfBirth: yup.date()
    .required()
    .min(new Date(1930, 0, 1), 'Date must be after 1930')
    .max(new Date(new Date().getFullYear() - 8, 11, 31), 'Date must be before {{year}}'),
  gender: yup.string().oneOf(['male','female','na']).required(),
  activityLevel: yup.string().oneOf(['sedentary','light','moderate','high','extreme']).required(),
  heightUnit: yup.string().oneOf(['cm','in','ft_in']).required(),
  heightRaw: yup.number().positive().nullable().optional(),
  heightFtRaw: yup.number().integer().positive().nullable().optional(),
  heightInRaw: yup.number().integer().positive().nullable().optional(),
  weightRaw: yup.number().positive().nullable().optional(),
  weightUnit: yup.string().oneOf(['kg','lb']).optional(),
  timezone: yup.string().required(),
  language: yup.string().required()
});
```

---

## Step 1 — Backend mapping (on final submit)

At Step 7 Submit, the server receives the whole onboarding payload. The portion from Step 1 maps as follows.

### Conversion rules (server-side)

- **Height → meters**
  - If `heightUnit == 'cm'`: `meters = heightRaw / 100`
  - If `heightUnit == 'in'`: `meters = heightRaw * 0.0254`
  - If `heightUnit == 'ft_in'`: `meters = (heightFtRaw * 12 + heightInRaw) * 0.0254`
- **Weight → kilograms**
  - If `weightUnit == 'kg'`: use as is
  - If `weightUnit == 'lb'`: `kg = weightRaw * 0.45359237`
  -

### Tables & columns affected

#### `user_profiles` (upsert by `user_id`)

- `user_id` — from auth
- `date_of_birth` — `YYYY-m-d (derived from ``yearOfBirth`)
- `gender` — as selected
- `height` — meters (nullable if not provided)
- `unit_system` — **update** to the chosen toggle (`metric`/`imperial`)
- `timezone` — keep as-is from profile&#x20;

#### `measurements` (optional baseline insert)

- Create **one** row **only if** `weightRaw` was provided in Step 1
  - `id` — **generated by backend** (64-hex TEXT)
  - `user_id`
  - `measured_at` — `NOW()` (or accept a date if you add it later)
  - `weight` — kilograms (converted)
  - Other columns NULL

#### `user_profile_assessments` (current snapshot; created in same transaction)

- Close any existing current row: `valid_to = NOW()` where `valid_to IS NULL`.
- Insert new row including:
  - `user_id`
  - `activity_level` — from Step 1 `activityLevel`
  - (Other fields from later steps will also populate this row at the same time.)

### Pseudocode (service layer)

```scala
transact(xa) {
  upsertUserProfile(userId, dobFromYear, gender, heightMetersOrNull, unitSystem, timezone)

  weightKg.foreach { kg =>
    insertMeasurementBaseline(newId(), userId, now(), kg)
  }

  closeCurrentAssessment(userId)
  insertAssessment(
    id = newId(),
    userId = userId,
    activityLevel = payload.personal.activityLevel,
    // other fields from later steps provided in same payload
    validFrom = now(), validTo = null
  )
}
```

### Error handling (per-section)

- On validation error (server-side), return a structured error payload referencing **Step 1** fields so the client can focus that step.

---

## Test checklist

- **UI**: toggling units switches inputs correctly; validation blocks only required fields; height & weight optional.
- **LocalStorage**: clicking Next writes the Step 1 slice under `onboarding/step1/v1/<userId>`; reload resumes values.
- **Backend**: final submit converts units correctly; profile upsert works; baseline measurement is created only when weight provided; assessment row includes activity level.

---

##

- Show **imperial height** as  feet+inches&#x20;
- Don't allow **decimal inches** (e.g., 5 ft 10.5 in). 5 ft 10 in is enough

---

##

