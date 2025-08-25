SET timezone = 'UTC';

-- USERS
CREATE TABLE "users"
(
  "id"              TEXT        NOT NULL,
  "login"           TEXT        NOT NULL,
  "login_lowercase" TEXT        NOT NULL,
  "email_lowercase" TEXT        NOT NULL,
  "password"        TEXT        NOT NULL,
  "language"        VARCHAR(5)  NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'sl')),
  "timezone"        VARCHAR(50) NOT NULL DEFAULT 'UTC', -- 'User timezone (e.g., UTC, Europe/Ljubljana)'
  "unit_system"     VARCHAR(10) NOT NULL DEFAULT 'metric' CHECK (unit_system IN ('metric','imperial')),
  "created_at"      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at"      TIMESTAMPTZ NOT NULL DEFAULT NOW()
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

  name                VARCHAR(255),
  date_of_birth       DATE,
  gender              VARCHAR(50),
  height              DOUBLE PRECISION, -- store meters if you want a canonical unit
  bio                 TEXT,
  avatar_url          TEXT,

  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2) Assessments with history (quarterly-ish, keep full history)
CREATE TABLE IF NOT EXISTS user_profile_assessments (
  id                       TEXT PRIMARY KEY,
  user_id                  TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Snapshot fields captured at assessment time
  activity_level           VARCHAR(50),     -- e.g. sedentary/light/moderate/high
  experience_level         VARCHAR(50),     -- e.g. novice/intermediate/advanced
  has_consistent_training  BOOLEAN,
  inactivity_duration      VARCHAR(50),     -- keep free-text for MVP
  consistency_issues       TEXT,

  -- Arrays keep schema lean for MVP; add checks/lookup tables later if needed
  consistency_issue_tags   TEXT[] DEFAULT NULL,
  health_flags             TEXT[] DEFAULT NULL,
  training_preferences     TEXT[] DEFAULT NULL,

  -- SCD-2 validity window
  valid_from               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  valid_to                 TIMESTAMPTZ,    -- NULL = current
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT ck_assessment_validity
    CHECK (valid_to IS NULL OR valid_to > valid_from)
);

-- Ensure only one current assessment per user
CREATE UNIQUE INDEX IF NOT EXISTS ux_user_profile_assessment_current
  ON user_profile_assessments (user_id)
  WHERE valid_to IS NULL;

-- Helpful for as-of queries
CREATE INDEX IF NOT EXISTS idx_user_profile_assessment_user_from
  ON user_profile_assessments (user_id, valid_from DESC);


-- ===========================
-- Measurements
-- ===========================
CREATE TABLE IF NOT EXISTS measurements (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    unit_system VARCHAR(10) NOT NULL CHECK (unit_system IN ('metric','imperial')), -- 'metric' | 'imperial' (what user used at entry time)
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
CREATE INDEX IF NOT EXISTS idx_measurements_created_at ON measurements(created_at);

-- ===========================
-- Goals (Flexible Model)
-- ===========================
CREATE TABLE IF NOT EXISTS goals (
    id TEXT PRIMARY KEY,
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
    id TEXT PRIMARY KEY,
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
ALTER TABLE preferences ADD CONSTRAINT preferences_user_unique UNIQUE (user_id);

-- ===========================
-- Injuries
-- ===========================
CREATE TABLE IF NOT EXISTS injuries (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    injury_name VARCHAR(255) NOT NULL,
    injury_description VARCHAR(255) NOT NULL, -- symptoms, location... (AI can help expand this)
    injury_tags TEXT[] DEFAULT NULL, -- e.g., 'low_back', 'chronic', 'postpartum'
    status VARCHAR(50) DEFAULT 'Active', -- Active, Resolved, Chronic
    onset_date DATE,
    side TEXT,            -- 'left' | 'right' | 'bilateral' | free text
    severity VARCHAR(20),        -- 'mild' | 'moderate' | 'severe'
    pain_scale SMALLINT,         -- 0..10
    aggravating_factors TEXT,
    alleviating_factors TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_injuries_user_id ON injuries(user_id);

CREATE TABLE IF NOT EXISTS injury_status_events (
  id TEXT PRIMARY KEY,
  injury_id TEXT NOT NULL REFERENCES injuries(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,         -- 'Active' | 'Resolved' | 'Chronic' | 'Aggravated' | 'Relieved' etc.
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_injury_status_events_injury ON injury_status_events(injury_id, created_at DESC);


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

CREATE TABLE IF NOT EXISTS ai_conversations (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  topic_type TEXT,
  topic_id   TEXT,
  title      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_messages (
  id              TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
  user_id         TEXT REFERENCES users(id) ON DELETE SET NULL, -- for 'user' messages (NULL for assistant/system)
  role            VARCHAR(20) NOT NULL,    -- 'user'|'assistant'|'system'|'tool'
  content         TEXT NOT NULL,
  model           TEXT,
  provider        TEXT,
  usage_prompt_tokens     INT,
  usage_completion_tokens INT,
  usage_total_tokens      INT,
  metadata        JSONB,                   -- tool calls, safety flags, etc.
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_messages_conv_time ON ai_messages(conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_ai_messages_role      ON ai_messages(role);
