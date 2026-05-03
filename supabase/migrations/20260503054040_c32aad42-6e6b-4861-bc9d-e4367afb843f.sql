ALTER TABLE public.ratha_yatra_registrations
  ADD COLUMN IF NOT EXISTS t14_reminder_sent boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS t1_reminder_sent boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS thankyou_sent boolean NOT NULL DEFAULT false;