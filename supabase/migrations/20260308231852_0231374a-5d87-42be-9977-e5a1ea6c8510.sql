
-- Create storage bucket for specimen photos
INSERT INTO storage.buckets (id, name, public) VALUES ('specimen-photos', 'specimen-photos', true);

-- Create submissions table
CREATE TABLE public.submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  image_path TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'analyzing', 'completed', 'failed')),
  common_name TEXT,
  scientific_name TEXT,
  family TEXT,
  colors JSONB,
  pattern TEXT,
  wing_shape TEXT,
  habitat TEXT,
  description TEXT,
  confidence TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Users can view their own submissions
CREATE POLICY "Users can view own submissions" ON public.submissions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Users can insert their own submissions
CREATE POLICY "Users can insert own submissions" ON public.submissions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Users can update their own submissions
CREATE POLICY "Users can update own submissions" ON public.submissions
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Users can delete their own submissions
CREATE POLICY "Users can delete own submissions" ON public.submissions
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Storage policies for specimen-photos bucket
CREATE POLICY "Authenticated users can upload photos" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'specimen-photos');

CREATE POLICY "Anyone can view specimen photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'specimen-photos');

CREATE POLICY "Users can delete own photos" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'specimen-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
