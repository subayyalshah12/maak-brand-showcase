CREATE TABLE public.inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  phone text CHECK (phone IS NULL OR char_length(phone) <= 30),
  email text CHECK (email IS NULL OR char_length(email) <= 255),
  inquiry_type text NOT NULL CHECK (inquiry_type IN ('general','construction','real_estate','education')),
  message text NOT NULL CHECK (char_length(message) BETWEEN 1 AND 2000),
  reference text CHECK (reference IS NULL OR char_length(reference) <= 200),
  status text NOT NULL DEFAULT 'new',
  internal_notes text,
  follow_up_date date,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.inquiries TO anon, authenticated;
GRANT ALL ON public.inquiries TO service_role;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit an inquiry" ON public.inquiries
  FOR INSERT TO anon, authenticated
  WITH CHECK (status = 'new' AND internal_notes IS NULL AND follow_up_date IS NULL);