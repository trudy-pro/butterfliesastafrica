-- Allow any authenticated user to insert submissions (analysts can submit for review)
DROP POLICY IF EXISTS "Approved users can insert submissions" ON public.submissions;

CREATE POLICY "Authenticated users can insert submissions"
ON public.submissions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Add submission_type column to distinguish contributor uploads vs analyst submissions
ALTER TABLE public.submissions ADD COLUMN IF NOT EXISTS submission_type text NOT NULL DEFAULT 'analyst_request';

-- Add a comment for clarity
COMMENT ON COLUMN public.submissions.submission_type IS 'Type of submission: analyst_request (for review) or contributor_upload (direct)';