/*
  # Menambahkan Data Siswa Kelas 4

  1. Deskripsi
    - Menambahkan 16 siswa kelas 4 (8 laki-laki, 8 perempuan)
    - Total siswa: 16 siswa
    
  2. Detail Data
    - Menggunakan NIS dengan format: 2022001 dst (Tahun Masuk + Nomor Urut)
    - Kelas diset sebagai '4A' untuk semua siswa
*/

-- Menambahkan data siswa
INSERT INTO students (nis, name, class, created_at) VALUES
-- Siswa Perempuan
('2022001', 'Assyifatun Haifa', '4A', NOW()),
('2022003', 'Aqila Najwa', '4A', NOW()),
('2022004', 'Ariqa Fatina', '4A', NOW()),
('2022009', 'Masliana Putri', '4A', NOW()),
('2022011', 'Nory Khairiyah', '4A', NOW()),
('2022012', 'Olivia Ramadani', '4A', NOW()),
('2022015', 'Juta Pratama Novita', '4A', NOW()),
('2022016', 'Zulapka Siri Zahra', '4A', NOW()),
-- Siswa Laki-laki
('2022002', 'Arkan Alfarzi', '4A', NOW()),
('2022005', 'Ali Dapa', '4A', NOW()),
('2022006', 'Ibrahim Saputra', '4A', NOW()),
('2022007', 'M. Farhan Al-Getsy', '4A', NOW()),
('2022008', 'M. Alfi', '4A', NOW()),
('2022010', 'Maulana Fathi A.', '4A', NOW()),
('2022013', 'Rajya Kamisa Syahban', '4A', NOW()),
('2022014', 'Raffa Abdu Riski', '4A', NOW());