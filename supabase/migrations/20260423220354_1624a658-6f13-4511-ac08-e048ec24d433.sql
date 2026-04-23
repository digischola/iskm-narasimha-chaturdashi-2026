-- =========================================
-- prasadam_sponsorships
-- =========================================

-- 1. Rename whatsapp_number -> phone
ALTER TABLE public.prasadam_sponsorships
  RENAME COLUMN whatsapp_number TO phone;

-- 2. Add new columns (nullable first so we can backfill)
ALTER TABLE public.prasadam_sponsorships
  ADD COLUMN email TEXT,
  ADD COLUMN country_code TEXT,
  ADD COLUMN email_needs_backfill BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN phone_needs_verification BOOLEAN NOT NULL DEFAULT false;

-- 3. Backfill existing 2 rows
-- Maha (id 6e98925f-0d1a-478d-b45d-0059da7b47c2) — phone 96251504, default +65, needs verification
UPDATE public.prasadam_sponsorships
SET email = 'legacy-prasadam-' || id::text || '@needsbackfill.srikrishnamandir.org',
    email_needs_backfill = true,
    country_code = '+65',
    phone_needs_verification = true
WHERE id = '6e98925f-0d1a-478d-b45d-0059da7b47c2';

-- Mayank Verma (id 234e23e6-d5be-4652-b859-ca212d60bae7) — split +6598716543
UPDATE public.prasadam_sponsorships
SET email = 'legacy-prasadam-' || id::text || '@needsbackfill.srikrishnamandir.org',
    email_needs_backfill = true,
    country_code = '+65',
    phone = '98716543',
    phone_needs_verification = false
WHERE id = '234e23e6-d5be-4652-b859-ca212d60bae7';

-- 4. Defensive: backfill any other rows that might have slipped in (should be 0)
UPDATE public.prasadam_sponsorships
SET email = 'legacy-prasadam-' || id::text || '@needsbackfill.srikrishnamandir.org',
    email_needs_backfill = true
WHERE email IS NULL;

UPDATE public.prasadam_sponsorships
SET country_code = '+65',
    phone_needs_verification = true
WHERE country_code IS NULL;

-- 5. Apply NOT NULL + UNIQUE
ALTER TABLE public.prasadam_sponsorships
  ALTER COLUMN email SET NOT NULL,
  ALTER COLUMN country_code SET NOT NULL;

ALTER TABLE public.prasadam_sponsorships
  ADD CONSTRAINT prasadam_sponsorships_email_key UNIQUE (email),
  ADD CONSTRAINT prasadam_sponsorships_phone_key UNIQUE (phone);

-- =========================================
-- slf_registrations
-- =========================================

ALTER TABLE public.slf_registrations
  ADD COLUMN country_code TEXT;

ALTER TABLE public.slf_registrations
  ALTER COLUMN phone SET NOT NULL;

ALTER TABLE public.slf_registrations
  ADD CONSTRAINT slf_registrations_email_key UNIQUE (email),
  ADD CONSTRAINT slf_registrations_phone_key UNIQUE (phone);
