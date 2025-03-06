export interface Student {
  id: string;
  nis: string;
  name: string;
  class: string;
  gender: 'L' | 'P';
  address?: string;
  parent_name?: string;
  phone?: string;
  created_at: string;
}

export interface Payment {
  id: string;
  student_id: string;
  amount: number;
  month: string;
  payment_date: string;
  status: 'pending' | 'paid' | 'overdue';
  created_by: string;
  created_at: string;
}

export interface Activity {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  event_date: string;
  created_by: string;
  created_at: string;
}

export interface Profile {
  id: string;
  username: string;
  created_at: string;
}

export interface CashTransaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  transaction_date: string;
  created_by: string;
  created_at: string;
}