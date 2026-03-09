
CREATE TABLE public.examined_specimens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  specimen_id text NOT NULL,
  first_examined_at timestamp with time zone NOT NULL DEFAULT now(),
  serial_number text NOT NULL,
  UNIQUE (user_id, specimen_id)
);

ALTER TABLE public.examined_specimens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own examined specimens"
  ON public.examined_specimens
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own examined specimens"
  ON public.examined_specimens
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
