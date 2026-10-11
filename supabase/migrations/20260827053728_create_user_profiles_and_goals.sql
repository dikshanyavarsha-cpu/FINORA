/*
# Create user_profiles and user_goals tables for FINORA

1. New Tables
- `user_profiles`: Stores financial profile data for each authenticated user
  - id (uuid, PK, references auth.users)
  - age (integer)
  - monthly_income (numeric)
  - monthly_expenses (numeric)
  - monthly_investment (numeric)
  - current_savings (numeric)
  - existing_investments (numeric)
  - investment_experience (text: beginner/intermediate/advanced)
  - investment_horizon (integer, years)
  - risk_tolerance (text: conservative/moderate/aggressive)
  - has_onboarded (boolean, default false)
  - created_at (timestamptz)
  - updated_at (timestamptz)

- `user_goals`: Stores financial goals for each user
  - id (uuid, PK)
  - user_id (uuid, references auth.users, default auth.uid())
  - name (text)
  - target_amount (numeric)
  - current_amount (numeric)
  - target_date (date)
  - monthly_contribution (numeric)
  - priority (text: high/medium/low)
  - created_at (timestamptz)

2. Security
- RLS enabled on both tables
- user_profiles: users can only read/update their own profile (id = auth.uid())
- user_goals: users can CRUD only their own goals (user_id = auth.uid())
- user_id defaults to auth.uid() so inserts work without passing it
*/

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  age integer,
  monthly_income numeric,
  monthly_expenses numeric,
  monthly_investment numeric,
  current_savings numeric,
  existing_investments numeric,
  investment_experience text DEFAULT 'intermediate',
  investment_horizon integer DEFAULT 15,
  risk_tolerance text DEFAULT 'moderate',
  has_onboarded boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON user_profiles;
CREATE POLICY "select_own_profile"
ON user_profiles FOR SELECT
TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON user_profiles;
CREATE POLICY "insert_own_profile"
ON user_profiles FOR INSERT
TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON user_profiles;
CREATE POLICY "update_own_profile"
ON user_profiles FOR UPDATE
TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_profile" ON user_profiles;
CREATE POLICY "delete_own_profile"
ON user_profiles FOR DELETE
TO authenticated USING (auth.uid() = id);

CREATE TABLE IF NOT EXISTS user_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  target_amount numeric NOT NULL,
  current_amount numeric NOT NULL DEFAULT 0,
  target_date date,
  monthly_contribution numeric DEFAULT 0,
  priority text DEFAULT 'medium',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_goals" ON user_goals;
CREATE POLICY "select_own_goals"
ON user_goals FOR SELECT
TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_goals" ON user_goals;
CREATE POLICY "insert_own_goals"
ON user_goals FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_goals" ON user_goals;
CREATE POLICY "update_own_goals"
ON user_goals FOR UPDATE
TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_goals" ON user_goals;
CREATE POLICY "delete_own_goals"
ON user_goals FOR DELETE
TO authenticated USING (auth.uid() = user_id);
