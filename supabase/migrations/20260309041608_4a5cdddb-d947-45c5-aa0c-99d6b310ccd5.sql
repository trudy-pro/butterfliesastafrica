
-- Create environmental profile table
CREATE TABLE public.user_environment_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  climate_zone text NOT NULL DEFAULT 'tropical',
  habitat_type text NOT NULL DEFAULT 'suburban_garden',
  latitude numeric,
  longitude numeric,
  signup_season text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_environment_profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own environment profile"
  ON public.user_environment_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own environment profile"
  ON public.user_environment_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own environment profile"
  ON public.user_environment_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all environment profiles"
  ON public.user_environment_profiles
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
