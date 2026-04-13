ALTER TABLE public.registrations
  ADD COLUMN IF NOT EXISTS confirmation_sent boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS reminder_sent boolean NOT NULL DEFAULT false;