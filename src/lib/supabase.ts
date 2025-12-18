import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  full_name: string;
  role: 'admin' | 'manager' | 'employee';
  phone: string | null;
  region_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Region = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  created_by: string | null;
};

export type Family = {
  id: string;
  family_number: string;
  head_of_family: string;
  phone: string | null;
  address: string | null;
  region_id: string | null;
  family_members_count: number;
  monthly_income: number;
  notes: string | null;
  created_at: string;
  created_by: string | null;
  updated_at: string;
  updated_by: string | null;
};

export type AssistanceType = {
  id: string;
  category: 'material' | 'goods' | 'electronics' | 'bills' | 'relief';
  name: string;
  unit: string;
  is_active: boolean;
  created_at: string;
};

export type Assistance = {
  id: string;
  family_id: string;
  assistance_type_id: string;
  amount: number;
  notes: string | null;
  assistance_date: string;
  created_at: string;
  created_by: string | null;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  unit: string;
  total_quantity: number;
  distributed_quantity: number;
  remaining_quantity: number;
  created_at: string;
  updated_at: string;
};

export type Task = {
  id: string;
  family_id: string;
  employee_id: string;
  assistance_type_id: string;
  product_id: string | null;
  quantity: number;
  status: 'pending' | 'completed' | 'cancelled';
  notes: string | null;
  employee_notes: string | null;
  assigned_date: string;
  completed_date: string | null;
  created_by: string | null;
  created_at: string;
};