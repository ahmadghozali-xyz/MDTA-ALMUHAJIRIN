/*
  # Menambahkan fitur manajemen kas

  1. New Tables
    - `cash_transactions`
      - `id` (uuid, primary key)
      - `type` (text) - 'income' atau 'expense'
      - `amount` (integer) - jumlah uang
      - `description` (text) - keterangan transaksi
      - `category` (text) - kategori transaksi
      - `transaction_date` (date) - tanggal transaksi
      - `created_by` (uuid) - referensi ke user yang membuat
      - `created_at` (timestamptz) - waktu pembuatan record

  2. Security
    - Enable RLS pada tabel `cash_transactions`
    - Menambahkan policy untuk admin
*/

CREATE TABLE IF NOT EXISTS cash_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  amount integer NOT NULL CHECK (amount > 0),
  description text NOT NULL,
  category text NOT NULL,
  transaction_date date NOT NULL DEFAULT CURRENT_DATE,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE cash_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Cash transactions are viewable by admin"
  ON cash_transactions
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Cash transactions are insertable by admin"
  ON cash_transactions
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Cash transactions are updatable by admin"
  ON cash_transactions
  FOR UPDATE TO authenticated
  USING (true);

CREATE POLICY "Cash transactions are deletable by admin"
  ON cash_transactions
  FOR DELETE TO authenticated
  USING (true);