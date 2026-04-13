CREATE POLICY "Service role can update registrations"
ON public.registrations FOR UPDATE
TO public
USING (auth.role() = 'service_role'::text)
WITH CHECK (auth.role() = 'service_role'::text);