/*
  # Menambahkan Data Siswa Kelas 1

  1. Deskripsi
    - Menambahkan 29 siswa kelas 1 (14 laki-laki, 15 perempuan)
    - Total siswa aktif: 29 siswa (3 siswa sudah keluar)
    
  2. Detail Data
    - Menggunakan NIS dengan format: 2025001 dst (Tahun Masuk + Nomor Urut)
    - Kelas diset sebagai '1A' untuk semua siswa
*/

-- Menambahkan data siswa laki-laki
INSERT INTO students (nis, name, class, created_at) VALUES
('2025001', 'Albijar Ananda Zulfi', '1A', NOW()),
('2025004', 'Agam Abdillah Pratama', '1A', NOW()),
('2025005', 'Ahmad Ramadhan', '1A', NOW()),
('2025006', 'Aidil Rusdiani Kholil', '1A', NOW()),
('2025010', 'Fazri Tri Ramadhan', '1A', NOW()),
('2025011', 'Fauzi Akbar Rindra', '1A', NOW()),
('2025012', 'Maulana Felori', '1A', NOW()),
('2025013', 'Gibran Raka Loumi', '1A', NOW()),
('2025014', 'Habibil Rizki Zulfi', '1A', NOW()),
('2025015', 'Kevin Ardana Putra', '1A', NOW()),
('2025016', 'M. Fatir Aminullah', '1A', NOW()),
('2025017', 'M. Wiliyyan Saputra', '1A', NOW()),
('2025023', 'Alam Syafutra', '1A', NOW()),
('2025024', 'Wiratama Akil Sandi', '1A', NOW());

-- Menambahkan data siswa perempuan
INSERT INTO students (nis, name, class, created_at) VALUES
('2025002', 'Adiba Syorfia Inara', '1A', NOW()),
('2025003', 'Afifah Nahda Rafanda', '1A', NOW()),
('2025007', 'Aisyah Alesa Zara', '1A', NOW()),
('2025008', 'Amelia Rahayu', '1A', NOW()),
('2025009', 'Cantika Rivia Kamiko', '1A', NOW()),
('2025018', 'Naura Klaris A Oktavia', '1A', NOW()),
('2025019', 'Naira Nala Diva Azzahra', '1A', NOW()),
('2025020', 'Queen Alzena Wijaya', '1A', NOW()),
('2025021', 'Denada Saura', '1A', NOW()),
('2025022', 'Suci Mulyani', '1A', NOW()),
('2025025', 'Zahra Ratifa', '1A', NOW()),
('2025027', 'Zaura Nur Hitatun', '1A', NOW()),
('2025028', 'Syakira Qurrota Ayun', '1A', NOW()),
('2025029', 'Fabia Zefania', '1A', NOW()),
('2025032', 'Syakila Ulfaira Sivegar', '1A', NOW());