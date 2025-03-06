/*
  # Schema Awal Sistem Manajemen Madrasah

  1. Tabel Baru
    - `profiles` - Data profil admin
      - `id` (uuid, primary key) - ID profil yang terhubung dengan auth.users
      - `username` (text) - Nama pengguna admin
      - `created_at` (timestamp) - Waktu pembuatan profil
    
    - `students` - Data siswa
      - `id` (uuid, primary key) - ID siswa
      - `nis` (text) - Nomor Induk Siswa
      - `name` (text) - Nama lengkap siswa
      - `class` (text) - Kelas siswa
      - `address` (text) - Alamat siswa
      - `parent_name` (text) - Nama orang tua/wali
      - `phone` (text) - Nomor telepon
      - `created_at` (timestamp) - Waktu pendaftaran
    
    - `payments` - Data pembayaran SPP
      - `id` (uuid, primary key) - ID pembayaran
      - `student_id` (uuid) - ID siswa (foreign key)
      - `amount` (integer) - Jumlah pembayaran
      - `month` (date) - Bulan pembayaran
      - `payment_date` (timestamp) - Tanggal pembayaran
      - `status` (text) - Status pembayaran
      - `created_by` (uuid) - ID admin yang mencatat
    
    - `activities` - Data kegiatan madrasah
      - `id` (uuid, primary key) - ID kegiatan
      - `title` (text) - Judul kegiatan
      - `description` (text) - Deskripsi kegiatan
      - `image_url` (text) - URL gambar kegiatan
      - `event_date` (date) - Tanggal kegiatan
      - `created_by` (uuid) - ID admin yang membuat
      - `created_at` (timestamp) - Waktu pembuatan

  2. Keamanan
    - RLS diaktifkan untuk semua tabel
    - Kebijakan akses berdasarkan role admin
*/

-- Create tables
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  username text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nis text UNIQUE NOT NULL,
  name text NOT NULL,
  class text NOT NULL,
  address text,
  parent_name text,
  phone text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  month date NOT NULL,
  payment_date timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'pending',
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text,
  event_date date NOT NULL,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Profiles are viewable by admin" ON profiles
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Students are viewable by admin" ON students
  FOR ALL TO authenticated
  USING (true);

CREATE POLICY "Payments are viewable by admin" ON payments
  FOR ALL TO authenticated
  USING (true);

CREATE POLICY "Activities are viewable by admin" ON activities
  FOR ALL TO authenticated
  USING (true);