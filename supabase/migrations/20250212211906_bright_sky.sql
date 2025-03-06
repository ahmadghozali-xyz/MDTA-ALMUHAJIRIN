/*
  # Fix Activities Data and Policies

  1. Changes
    - Add sample activities data
    - Update RLS policies for activities table
    - Allow public read access to activities

  2. Security
    - Enable RLS on activities table
    - Add policy for public to read activities
    - Add policy for authenticated users to manage activities
*/

-- Add sample activities data
INSERT INTO activities (title, description, event_date, created_at) VALUES
('Peringatan Maulid Nabi Muhammad SAW', 
 'Kegiatan peringatan Maulid Nabi Muhammad SAW dengan pembacaan shalawat dan ceramah agama.',
 '2025-01-15',
 NOW()
),
('Wisuda Tahfidz Al-Quran', 
 'Acara wisuda santri yang telah menyelesaikan hafalan Al-Quran.',
 '2025-02-20',
 NOW()
),
('Lomba MTQ Antar Kelas', 
 'Kompetisi Musabaqah Tilawatil Quran antar kelas untuk meningkatkan kemampuan membaca Al-Quran.',
 '2025-03-10',
 NOW()
);

-- Drop existing policies
DROP POLICY IF EXISTS "Activities are viewable by admin" ON activities;

-- Update RLS policies
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Allow public to view activities
CREATE POLICY "Anyone can view activities"
  ON activities
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to manage activities
CREATE POLICY "Authenticated users can manage activities"
  ON activities
  USING (auth.role() = 'authenticated');