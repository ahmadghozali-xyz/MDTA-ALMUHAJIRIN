/*
  # Update tabel pembayaran SPP

  1. Perubahan
    - Menambahkan kolom academic_year untuk tahun ajaran
    - Menambahkan kolom month untuk bulan pembayaran (integer)
    - Menambahkan unique constraint untuk mencegah duplikasi pembayaran
    
  2. Detail
    - Tahun ajaran: format YYYY/YYYY (contoh: 2024/2025)
    - Bulan: 1-12 (Januari-Desember)
    - Status: 'unpaid', 'paid'
*/

-- Drop existing month column if it exists
ALTER TABLE payments DROP COLUMN IF EXISTS month;

-- Hapus data lama jika ada
TRUNCATE TABLE payments;

-- Ubah struktur tabel payments
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_pkey CASCADE;
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_student_month_key CASCADE;

-- Add new columns
ALTER TABLE payments 
  ADD COLUMN IF NOT EXISTS academic_year text,
  ADD COLUMN month integer CHECK (month BETWEEN 1 AND 12);

-- Tambahkan constraints
ALTER TABLE payments 
  ADD PRIMARY KEY (id),
  ADD CONSTRAINT payments_student_month_year_key UNIQUE (student_id, month, academic_year);

-- Set default status untuk semua siswa menjadi unpaid
INSERT INTO payments (student_id, amount, month, academic_year, status, payment_date)
SELECT 
  s.id,
  250000,
  m.month,
  '2024/2025',
  'unpaid',
  NULL
FROM students s
CROSS JOIN generate_series(1, 12) AS m(month);