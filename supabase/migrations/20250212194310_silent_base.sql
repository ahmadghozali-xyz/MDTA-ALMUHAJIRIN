/*
  # Menambahkan kolom gender pada tabel students

  1. Perubahan
    - Menambahkan kolom gender dengan tipe text
    - Mengupdate data yang sudah ada dengan nilai default
    
  2. Detail
    - Gender: 'L' untuk laki-laki, 'P' untuk perempuan
*/

-- Menambahkan kolom gender
ALTER TABLE students ADD COLUMN IF NOT EXISTS gender text;

-- Update data kelas 1
UPDATE students 
SET gender = 'L'
WHERE nis IN (
  '2025001', '2025004', '2025005', '2025006', '2025010', 
  '2025011', '2025012', '2025013', '2025014', '2025015', 
  '2025016', '2025017', '2025023', '2025024'
);

UPDATE students 
SET gender = 'P'
WHERE nis IN (
  '2025002', '2025003', '2025007', '2025008', '2025009',
  '2025018', '2025019', '2025020', '2025021', '2025022',
  '2025025', '2025027', '2025028', '2025029', '2025032'
);

-- Update data kelas 2
UPDATE students 
SET gender = 'L'
WHERE nis IN (
  '2024004', '2024005', '2024009', '2024011', '2024013',
  '2024016', '2024001'
);

UPDATE students 
SET gender = 'P'
WHERE nis IN (
  '2024002', '2024003', '2024006', '2024007', '2024008',
  '2024010', '2024012', '2024014', '2024015', '2024017',
  '2024018', '2024019'
);

-- Update data kelas 3
UPDATE students 
SET gender = 'L'
WHERE nis IN ('2023013', '2023014');

UPDATE students 
SET gender = 'P'
WHERE nis IN (
  '2023001', '2023002', '2023003', '2023004', '2023005',
  '2023006', '2023007', '2023008', '2023009', '2023010',
  '2023011', '2023012'
);

-- Update data kelas 4
UPDATE students 
SET gender = 'L'
WHERE nis IN (
  '2022002', '2022005', '2022006', '2022007', '2022008',
  '2022010', '2022013', '2022014'
);

UPDATE students 
SET gender = 'P'
WHERE nis IN (
  '2022001', '2022003', '2022004', '2022009', '2022011',
  '2022012', '2022015', '2022016'
);

-- Set kolom gender menjadi NOT NULL setelah semua data diupdate
ALTER TABLE students ALTER COLUMN gender SET NOT NULL;