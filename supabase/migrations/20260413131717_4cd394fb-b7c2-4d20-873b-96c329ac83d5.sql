
CREATE TABLE public.slf_registrations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  attendees integer NOT NULL DEFAULT 1,
  first_time boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.slf_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can register for SLF"
  ON public.slf_registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Only admins can read SLF registrations"
  ON public.slf_registrations
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));
