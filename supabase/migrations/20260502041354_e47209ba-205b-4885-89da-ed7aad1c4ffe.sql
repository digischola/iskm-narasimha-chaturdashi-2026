CREATE TABLE public.ratha_yatra_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  attendees integer NOT NULL DEFAULT 1,
  is_volunteer boolean NOT NULL DEFAULT false,
  confirmation_sent boolean NOT NULL DEFAULT false,
  reminder_sent boolean NOT NULL DEFAULT false
);

ALTER TABLE public.ratha_yatra_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can register for Ratha Yatra"
  ON public.ratha_yatra_registrations FOR INSERT
  TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Only admins can read Ratha Yatra registrations"
  ON public.ratha_yatra_registrations FOR SELECT
  TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role full access on ratha_yatra"
  ON public.ratha_yatra_registrations FOR ALL
  TO public USING (auth.role() = 'service_role'::text)
  WITH CHECK (auth.role() = 'service_role'::text);