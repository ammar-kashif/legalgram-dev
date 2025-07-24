-- Create table for document users/contact information
CREATE TABLE public.document_users (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    document_type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    ip_address INET,
    user_agent TEXT
);

-- Enable Row Level Security
ALTER TABLE public.document_users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (since this is for document generation)
CREATE POLICY "Anyone can create document user entries" 
ON public.document_users 
FOR INSERT 
WITH CHECK (true);

-- Create policy for viewing (admin access)
CREATE POLICY "Admins can view all document users" 
ON public.document_users 
FOR SELECT 
USING (true);

-- Create index for better performance
CREATE INDEX idx_document_users_email ON public.document_users(email);
CREATE INDEX idx_document_users_document_type ON public.document_users(document_type);
CREATE INDEX idx_document_users_created_at ON public.document_users(created_at DESC);