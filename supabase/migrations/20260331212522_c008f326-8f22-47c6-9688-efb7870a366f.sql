-- Create registrations table
CREATE TABLE public.registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  attendees INTEGER NOT NULL DEFAULT 1,
  is_volunteer BOOLEAN NOT NULL DEFAULT false,
  age TEXT,
  gender TEXT,
  remarks TEXT,
  volunteer_categories TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public registration form, no auth required)
CREATE POLICY "Anyone can register"
  ON public.registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow authenticated users to read registrations (for admin dashboard)
CREATE POLICY "Authenticated users can read registrations"
  ON public.registrations
  FOR SELECT
  TO authenticated
  USING (true);