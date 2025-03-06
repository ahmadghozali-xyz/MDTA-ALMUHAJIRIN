/*
  # Menambahkan Data Siswa Kelas 3

  1. Deskripsi
    - Menambahkan 14 siswa kelas 3 (2 laki-laki, 12 perempuan)
    - Total siswa: 14 siswa
    
  2. Detail Data
    - Menggunakan NIS dengan format: 2023001 dst (Tahun Masuk + Nomor Urut)
    - Kelas diset sebagai '3A' untuk semua siswa
*/

-- Menambahkan data siswa
INSERT INTO students (nis, name, class, created_at) VALUES
-- Siswa Perempuan
('2023001', 'Atifa Kalila Sakhi', '3A', NOW()),
('2023002', 'Akifah Khaira Fitri', '3A', NOW()),
('2023003', 'Alika Maila Ramadiani', '3A', NOW()),
('2023004', 'Adzani Munawaroh', '3A', NOW()),
('2023005', 'Adzraa Apmika S.', '3A', NOW()),
('2023006', 'Alisya Nabila Zahra', '3A', NOW()),
('2023007', 'Adzkia Zaltira', '3A', NOW()),
('2023008', 'Bilgis Ramadhani', '3A', NOW()),
('2023009', 'Dini Rayfah Anggrayni', '3A', NOW()),
('2023010', 'Drakira Talita Zahra', '3A', NOW()),
('2023011', 'Naura Febrianti', '3A', NOW()),
('2023012', 'Raida Rasydah', '3A', NOW()),
-- Siswa Laki-laki
('2023013', 'Muhammad Fauzan', '3A', NOW()),
('2023014', 'Syafia Hanif S.', '3A', NOW());