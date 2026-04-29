-- Supabase Database Schema for CA Platform

-- 1. Profiles Table (Extends Auth Users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  report_unlocked BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Questions Table (Mock Test Content)
CREATE TABLE IF NOT EXISTS public.questions (
  id BIGSERIAL PRIMARY KEY,
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer TEXT NOT NULL, -- e.g., 'A', 'B', 'C', 'D'
  topic TEXT DEFAULT 'General',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Test Results Table (Student Performance)
CREATE TABLE IF NOT EXISTS public.test_results (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  total_score INTEGER DEFAULT 0, -- raw count of correct answers
  total_questions INTEGER DEFAULT 15,
  topic_scores JSONB DEFAULT '{}'::jsonb, -- structured data: { "Tax": { "correct": 2, "total": 3 } }
  test_title TEXT DEFAULT 'CA Mock Assessment',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;

-- 5. Profiles Policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- 6. Questions Policies
CREATE POLICY "Questions are viewable by everyone" 
ON public.questions FOR SELECT 
TO authenticated, anon
USING (true);

-- 7. Test Results Policies
CREATE POLICY "Users can view their own test results" 
ON public.test_results FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own test results" 
ON public.test_results FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 8. Functions & Triggers (Optional: Auto-create profile on signup)
-- CREATE OR REPLACE FUNCTION public.handle_new_user()
-- RETURNS trigger AS $$
-- BEGIN
--   INSERT INTO public.profiles (id, full_name)
--   VALUES (new.id, new.raw_user_meta_data->>'full_name');
--   RETURN new;
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;

-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
