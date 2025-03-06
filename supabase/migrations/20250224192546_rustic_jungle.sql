/*
  # Fix registrations table policies

  1. Changes
    - Drop and recreate all policies for registrations table
    - Add policy for updating registration status
    - Add policy for deleting registrations

  2. Security
    - Public can insert new registrations
    - Only authenticated users can view, update, and delete registrations
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can insert registrations" ON registrations;
DROP POLICY IF EXISTS "Authenticated users can view registrations" ON registrations;
DROP POLICY IF EXISTS "Authenticated users can update registrations" ON registrations;
DROP POLICY IF EXISTS "Authenticated users can delete registrations" ON registrations;

-- Recreate policies with proper permissions
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

CREATE POLICY "Authenticated users can delete registrations"
  ON registrations
  FOR DELETE
  TO authenticated
  USING (true);

-- Add indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(status);
CREATE INDEX IF NOT EXISTS idx_registrations_date ON registrations(registration_date DESC);
CREATE INDEX IF NOT EXISTS idx_registrations_student_name ON registrations(student_name);