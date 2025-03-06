/*
  # Fix Activities Storage Configuration

  1. Changes
    - Creates activities bucket if it doesn't exist
    - Safely adds storage policies with proper checks
    - Ensures public read access and authenticated user access for CRUD operations

  2. Security
    - Public can view files
    - Only authenticated users can upload, update, and delete files
*/

-- Create activities bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('activities', 'activities', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to activities bucket
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Public can view activities files'
  ) THEN
    CREATE POLICY "Public can view activities files"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'activities');
  END IF;
END $$;

-- Allow authenticated users to upload files
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can upload to activities'
  ) THEN
    CREATE POLICY "Authenticated users can upload to activities"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'activities');
  END IF;
END $$;

-- Allow authenticated users to update files
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can update activities files'
  ) THEN
    CREATE POLICY "Authenticated users can update activities files"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'activities');
  END IF;
END $$;

-- Allow authenticated users to delete files
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can delete activities files'
  ) THEN
    CREATE POLICY "Authenticated users can delete activities files"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'activities');
  END IF;
END $$;