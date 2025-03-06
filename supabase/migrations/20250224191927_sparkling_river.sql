/*
  # Fix authentication configuration

  1. Changes
    - Drop existing admin users
    - Create new admin user with proper configuration
    - Set up secure password hashing
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Remove any existing admin users first
DELETE FROM auth.users WHERE email = 'admin@mdta-almuhajirin.com';

-- Insert admin user with proper configuration
INSERT INTO auth.users (
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
)
VALUES (
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@mdta-almuhajirin.com',
  crypt('mdta2025', gen_salt('bf')),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  true,
  now(),
  now(),
  '',
  '',
  '',
  ''
)
ON CONFLICT (email) DO NOTHING;