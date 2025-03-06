/*
  # Create registrations table

  1. New Tables
    - `registrations`
      - `id` (uuid, primary key)
      - `student_name` (text)
      - `birth_date` (date)
      - `parent_name` (text)
      - `whatsapp` (text)
      - `address` (text)
      - `previous_school` (text, nullable)
      - `status` (text, default: 'pending')
      - `registration_date` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `registrations` table
    - Add policies for public insert and authenticated access
*/

-- Drop existing table if exists
DROP TABLE IF EXISTS registrations CASCADE;

-- Create registrations table
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