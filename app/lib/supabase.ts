// app/lib/supabase.ts

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para Supabase
export interface Database {
  public: {
    Tables: {
      empleados: {
        Row: {
          id: string;
          nombre: string;
          username: string;
          password_hash: string;
          area_id: string | null;
          activo: boolean;
          ultimo_acceso: string | null;
          ultima_nomina: string | null;
          deuda: number | null;
          tipo: number | null;
          sueldo_fijo: number | null;
        };
        Insert: {
          id?: string;
          nombre: string;
          username: string;
          password_hash: string;
          area_id?: string | null;
          activo?: boolean;
          ultimo_acceso?: string | null;
          ultima_nomina?: string | null;
          deuda?: number | null;
          tipo?: number | null;
          sueldo_fijo?: number | null;
        };
        Update: {
          id?: string;
          nombre?: string;
          username?: string;
          password_hash?: string;
          area_id?: string | null;
          activo?: boolean;
          ultimo_acceso?: string | null;
          ultima_nomina?: string | null;
          deuda?: number | null;
          tipo?: number | null;
          sueldo_fijo?: number | null;
        };
      };
    };
  };
}
