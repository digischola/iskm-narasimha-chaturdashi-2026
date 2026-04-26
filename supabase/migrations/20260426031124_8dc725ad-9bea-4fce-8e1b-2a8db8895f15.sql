ALTER TABLE public.slf_registrations
ADD COLUMN IF NOT EXISTS attendance_date date;

CREATE INDEX IF NOT EXISTS idx_slf_registrations_attendance_date
ON public.slf_registrations (attendance_date);