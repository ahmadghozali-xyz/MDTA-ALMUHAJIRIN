/*
  # Update registrations table

  1. Changes
    - Ensure registrations table exists with all required columns
    - Add missing policies for authenticated users
    - Add indexes for better performance

  2. Security
    - Maintain existing RLS policies
    - Add policy for authenticated users to manage registrations
*/

-- Ensure the table exists with all required columns
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'registrations'
  ) THEN
    CREATE TABLE registrations (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      student_name text NOT NULL,
      birth_date date NOT NULL,
      parent_name text NOT NULL,
      whatsapp text NOT NULL,
      address text NOT NULL,
      previous_school text,
      status text NOT NULL DEFAULT 'pending',
      registration_date timestamptz NOT NULL DEFAULT now(),
      created_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Enable RLS if not already enabled
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can insert registrations" ON registrations;
DROP POLICY IF EXISTS "Authenticated users can view registrations" ON registrations;
DROP POLICY IF EXISTS "Authenticated users can update registrations" ON registrations;

-- Recreate policies
CREATE POLICY "Anyone can insert registrations"
  ON registrations
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view registrations"
  ON registrations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update registrations"
  ON registrations
  FOR UPDATE
  TO authenticated
  USING (true);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(status);
CREATE INDEX IF NOT EXISTS idx_registrations_date ON registrations(registration_date DESC);
CREATE INDEX IF NOT EXISTS idx_registrations_student_name ON registrations(student_name);