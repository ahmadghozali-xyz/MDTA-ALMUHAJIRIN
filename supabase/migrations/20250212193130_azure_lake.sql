/*
  # Menambahkan Data Siswa Kelas 2

  1. Deskripsi
    - Menambahkan 19 siswa kelas 2 (7 laki-laki, 12 perempuan)
    - Total siswa: 19 siswa
    
  2. Detail Data
    - Menggunakan NIS dengan format: 2024001 dst (Tahun Masuk + Nomor Urut)
    - Kelas diset sebagai '2A' untuk semua siswa
*/

-- Menambahkan data siswa
INSERT INTO students (nis, name, class, created_at) VALUES
('2024001', 'Abri Syam Arsyad Yonendri', '2A', NOW()),
('2024002', 'Adara Madhira', '2A', NOW()),
('2024003', 'Afifah Kyzia Varisha', '2A', NOW()),
('2024004', 'Ari Muda Ismail', '2A', NOW()),
('2024005', 'Aldi Al Qodri', '2A', NOW()),
('2024006', 'Anindita Kaisha Harahap', '2A', NOW()),
('2024007', 'Anindita Puteri Eriandy', '2A', NOW()),
('2024008', 'Aqilla Azizah', '2A', NOW()),
('2024009', 'Ari Hamualan', '2A', NOW()),
('2024010', 'Askanah Sakhi Lubis', '2A', NOW()),
('2024011', 'Azka Saputra', '2A', NOW()),
('2024012', 'Bilqis Zivana Letisha', '2A', NOW()),
('2024013', 'Fahmi Utama Sidqi', '2A', NOW()),
('2024014', 'Febby Julia Rahmadani', '2A', NOW()),
('2024015', 'Madhira Nurrama Dhani', '2A', NOW()),
('2024016', 'Maviz Avito', '2A', NOW()),
('2024017', 'Shakila Zafrina', '2A', NOW()),
('2024018', 'Shalika Zafrina', '2A', NOW()),
('2024019', 'Syalika Alfadilah', '2A', NOW());