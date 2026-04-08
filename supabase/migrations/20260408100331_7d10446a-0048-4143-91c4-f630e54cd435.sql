DELETE FROM public.registrations
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at ASC) AS rn
    FROM public.registrations
  ) sub
  WHERE rn > 1
);

CREATE UNIQUE INDEX registrations_email_unique ON public.registrations (email);