SET timezone = 'UTC';

-- USERS
CREATE TABLE "users"
(
  "id"              TEXT        NOT NULL,
  "login"           TEXT        NOT NULL,
  "login_lowercase" TEXT        NOT NULL,
  "email_lowercase" TEXT        NOT NULL,
  "password"        TEXT        NOT NULL,
  "created_on"      TIMESTAMPTZ NOT NULL
);
ALTER TABLE "users"
  ADD CONSTRAINT "users_id" PRIMARY KEY ("id");
CREATE UNIQUE INDEX "users_login_lowercase" ON "users" ("login_lowercase");
CREATE UNIQUE INDEX "users_email_lowercase" ON "users" ("email_lowercase");

-- ===========================
-- User Profiles
-- ===========================
CREATE TABLE IF NOT EXISTS user_profiles (
    user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255),
    date_of_birth DATE,
    gender VARCHAR(50),
    height DOUBLE PRECISION,
    preferred_metric_system VARCHAR(10) DEFAULT 'metric', -- metric or imperial
    activity_level VARCHAR(50),
    experience_level VARCHAR(50),
    fitness_level VARCHAR(50), -- Self-assessed: Beginner, Intermediate, etc.
    has_consistent_training BOOLEAN, -- Have they trained consistently?
    inactivity_duration VARCHAR(50), -- e.g., "1 year", "a few weeks"
    consistency_issues TEXT, -- Raw input: What's held them back
    consistency_issue_tags TEXT[] DEFAULT NULL, -- Tagged values (e.g., 'lack_of_time', 'injury')
    health_flags TEXT[] DEFAULT NULL, -- e.g., 'hypertension', 'diabetes', 'postpartum'
    current_build VARCHAR(50), -- e.g., 'Lean', 'Overweight', 'Muscular'
    training_preferences TEXT[], -- e.g., 'strength_training', 'cardio', 'yoga', 'other:custom_value'
    bio TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

-- ===========================
-- Measurements
-- ===========================
CREATE TABLE IF NOT EXISTS measurements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    measured_at TIMESTAMPTZ DEFAULT NOW(),
    weight DOUBLE PRECISION,
    shoulder_circumference DOUBLE PRECISION,
    chest_circumference DOUBLE PRECISION,
    stomach_circumference DOUBLE PRECISION,
    waist_circumference DOUBLE PRECISION,
    hip_circumference DOUBLE PRECISION,
    thigh_circumference DOUBLE PRECISION,
    arm_circumference DOUBLE PRECISION,
    calf_circumference DOUBLE PRECISION,
    body_fat_percentage DOUBLE PRECISION,
    notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_measurements_user_id ON measurements(user_id);
CREATE INDEX IF NOT EXISTS idx_measurements_measured_at ON measurements(measured_at);

-- ===========================
-- Goals (Flexible Model)
-- ===========================
CREATE TABLE IF NOT EXISTS goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    goal_type VARCHAR(50) NOT NULL, -- e.g. weight, muscle, endurance, flexibility, skill
    goal_value TEXT,
    goal_description TEXT,
    goal_tags TEXT[] DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_type ON goals(goal_type);

-- ===========================
-- Preferences
-- ===========================
CREATE TABLE IF NOT EXISTS preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,

    weekly_training_days INT,
    session_duration VARCHAR(50),
    daily_routine_opt_in BOOLEAN DEFAULT FALSE,
    equipment TEXT[] DEFAULT NULL,
    location VARCHAR(255),
    current_stressors TEXT, -- Raw input
    current_stressor_tags TEXT[] DEFAULT NULL, -- e.g., 'work', 'sleep', 'childcare'
    goal_blockers TEXT, -- Raw input
    goal_blocker_tags TEXT[] DEFAULT NULL, -- e.g., 'travel', 'motivation', 'injury'
    other_preferences TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_preferences_user_id ON preferences(user_id);

-- ===========================
-- Injuries
-- ===========================
CREATE TABLE IF NOT EXISTS injuries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    injury_name VARCHAR(255) NOT NULL,
    injury_description VARCHAR(255) NOT NULL, -- symptoms, location... (AI can help expand this)
    injury_tags TEXT[] DEFAULT NULL, -- e.g., 'low_back', 'chronic', 'postpartum'
    status VARCHAR(50) DEFAULT 'Active', -- Active, Resolved, Chronic
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_injuries_user_id ON injuries(user_id); 


-- API KEYS
CREATE TABLE "api_keys"
(
  "id"          TEXT        NOT NULL,
  "user_id"     TEXT        NOT NULL,
  "created_on"  TIMESTAMPTZ NOT NULL,
  "valid_until" TIMESTAMPTZ NOT NULL
);
ALTER TABLE "api_keys"
  ADD CONSTRAINT "api_keys_id" PRIMARY KEY ("id");
ALTER TABLE "api_keys"
  ADD CONSTRAINT "api_keys_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- PASSWORD RESET CODES
CREATE TABLE "password_reset_codes"
(
  "id"          TEXT        NOT NULL,
  "user_id"     TEXT        NOT NULL,
  "valid_until" TIMESTAMPTZ NOT NULL
);
ALTER TABLE "password_reset_codes"
  ADD CONSTRAINT "password_reset_codes_id" PRIMARY KEY ("id");
ALTER TABLE "password_reset_codes"
  ADD CONSTRAINT "password_reset_codes_user_fk"
    FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- EMAILS
CREATE TABLE "scheduled_emails"
(
  "id"        TEXT NOT NULL,
  "recipient" TEXT NOT NULL,
  "subject"   TEXT NOT NULL,
  "content"   TEXT NOT NULL
);
ALTER TABLE "scheduled_emails"
  ADD CONSTRAINT "scheduled_emails_id" PRIMARY KEY ("id");
