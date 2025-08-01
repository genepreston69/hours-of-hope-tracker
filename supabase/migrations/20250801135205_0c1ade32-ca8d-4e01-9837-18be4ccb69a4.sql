-- Create notification recipients table
CREATE TABLE public.notification_recipients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  phone TEXT,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'supervisor',
  incident_reports_enabled BOOLEAN NOT NULL DEFAULT true,
  director_reports_enabled BOOLEAN NOT NULL DEFAULT true,
  email_enabled BOOLEAN NOT NULL DEFAULT true,
  sms_enabled BOOLEAN NOT NULL DEFAULT false,
  critical_only BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notification logs table
CREATE TABLE public.notification_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID NOT NULL,
  report_type TEXT NOT NULL CHECK (report_type IN ('incident', 'director')),
  recipient_email TEXT NOT NULL,
  recipient_phone TEXT,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('email', 'sms')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notification_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for notification_recipients
CREATE POLICY "Authenticated users can view all recipients" 
ON public.notification_recipients 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage recipients" 
ON public.notification_recipients 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create policies for notification_logs
CREATE POLICY "Authenticated users can view all logs" 
ON public.notification_logs 
FOR SELECT 
USING (true);

CREATE POLICY "System can create logs" 
ON public.notification_logs 
FOR INSERT 
WITH CHECK (true);

-- Create trigger for updating timestamps
CREATE TRIGGER update_notification_recipients_updated_at
BEFORE UPDATE ON public.notification_recipients
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default recipients (you can modify these)
INSERT INTO public.notification_recipients (email, phone, name, role, sms_enabled) VALUES 
('admin@example.com', '+1234567890', 'System Administrator', 'admin', true),
('supervisor@example.com', NULL, 'Department Supervisor', 'supervisor', false);