CREATE TABLE public.kids_ratha_yatra_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  adults integer NOT NULL DEFAULT 1,
  kids integer NOT NULL DEFAULT 0,
  source text,
  confirmation_sent boolean NOT NULL DEFAULT false,
  reminder_sent boolean NOT NULL DEFAULT false,
  thankyou_sent boolean NOT NULL DEFAULT false
);

ALTER TABLE public.kids_ratha_yatra_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can register for Kids Ratha Yatra"
  ON public.kids_ratha_yatra_registrations FOR INSERT
  TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Only admins can read Kids Ratha Yatra registrations"
  ON public.kids_ratha_yatra_registrations FOR SELECT
  TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role full access on kids_ratha_yatra"
  ON public.kids_ratha_yatra_registrations FOR ALL
  TO public USING (auth.role() = 'service_role'::text)
  WITH CHECK (auth.role() = 'service_role'::text);

CREATE INDEX idx_kry_email   ON public.kids_ratha_yatra_registrations (email);
CREATE INDEX idx_kry_phone   ON public.kids_ratha_yatra_registrations (phone);
CREATE INDEX idx_kry_created ON public.kids_ratha_yatra_registrations (created_at DESC);