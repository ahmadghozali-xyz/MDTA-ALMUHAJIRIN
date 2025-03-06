/*
  # Add default admin user

  1. Changes
    - Add default admin user with email and password
    - Enable email auth provider
    - Set up secure password hashing
*/

-- Enable the email auth provider
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Insert admin user
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  role,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmed_at
)
VALUES (
  gen_random_uuid(),
  'admin@mdta-almuhajirin.com',
  crypt('mdta2025', gen_salt('bf')),
  now(),
  now(),
  now(),
  'authenticated',
  '{"provider":"email","providers":["email"]}',
  '{}',
  false,
  now()
)
ON CONFLICT (email) DO NOTHING;