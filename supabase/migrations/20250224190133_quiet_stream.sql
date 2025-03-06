/*
  # Tambah Akun Admin Default

  1. Menambahkan akun admin default dengan kredensial:
     - Email: admin@mdta-almuhajirin.com
     - Password: mdta2025
*/

-- Tambahkan akun admin default
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change,
  last_sign_in_at
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@mdta-almuhajirin.com',
  crypt('mdta2025', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  '',
  NOW()
)
ON CONFLICT (email) DO NOTHING;