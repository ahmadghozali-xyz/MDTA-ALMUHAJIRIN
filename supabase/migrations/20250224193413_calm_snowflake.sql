/*
  # Fix registrations table

  1. Changes
    - Drop and recreate registrations table with proper structure
    - Add all necessary columns
    - Add proper indexes
    - Set up RLS policies

  2. Security
    - Public can insert new registrations
    - Only authenticated users can view, update, and delete registrations
*/

-- Drop existing table and policies
DROP TABLE IF EXISTS registrations CASCADE;

-- Create registrations table with proper structure
CREATE TABLE registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name text NOT NULL,
  birth_date date NOT NULL,
  parent_name text NOT NULL,
  whatsapp text NOT NULL,
  address text NOT NULL,
  previous_school text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  registration_date timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Create policies
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

-- Add indexes for better performance
CREATE INDEX idx_registrations_status ON registrations(status);
CREATE INDEX idx_registrations_date ON registrations(registration_date DESC);
CREATE INDEX idx_registrations_student_name ON registrations(student_name);