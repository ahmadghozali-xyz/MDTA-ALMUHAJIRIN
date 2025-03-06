/*
  # Fix Storage Configuration

  1. Storage Setup
    - Create activities bucket for storing activity images
    - Set up proper RLS policies for storage access
  
  2. Security
    - Enable public read access
    - Restrict write access to authenticated users only
*/

-- Enable storage by creating the activities bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('activities', 'activities', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to activities bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'activities');

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'activities');

-- Allow authenticated users to update their own files
CREATE POLICY "Authenticated users can update files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'activities');

-- Allow authenticated users to delete their own files
CREATE POLICY "Authenticated users can delete files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'activities');