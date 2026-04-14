
CREATE TABLE public.prasadam_sponsorships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  full_name TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  preferred_date DATE NOT NULL,
  occasion TEXT,
  tier TEXT NOT NULL,
  dedication TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT
);

ALTER TABLE public.prasadam_sponsorships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a sponsorship request"
ON public.prasadam_sponsorships
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Only admins can read sponsorship records"
ON public.prasadam_sponsorships
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update sponsorship records"
ON public.prasadam_sponsorships
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Service role full access"
ON public.prasadam_sponsorships
FOR ALL
TO public
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');
