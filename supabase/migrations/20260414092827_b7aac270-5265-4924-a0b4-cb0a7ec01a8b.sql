CREATE TABLE public.email_tracking_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  registration_id uuid,
  email_type text NOT NULL,
  event_type text NOT NULL,
  link_name text,
  recipient_email text NOT NULL,
  ip_address text,
  user_agent text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX idx_tracking_email_type ON public.email_tracking_events(email_type);
CREATE INDEX idx_tracking_event_type ON public.email_tracking_events(event_type);
CREATE INDEX idx_tracking_registration_id ON public.email_tracking_events(registration_id);

ALTER TABLE public.email_tracking_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can insert tracking events"
ON public.email_tracking_events
FOR INSERT
TO public
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Admins can read tracking events"
ON public.email_tracking_events
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Service role can read tracking events"
ON public.email_tracking_events
FOR SELECT
TO public
USING (auth.role() = 'service_role');