import { supabase } from "@/app/lib/supabase";
import type { User, LoginCredentials } from "@/app/types/auth";
import bcrypt from "bcryptjs";

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<User | null> {
    try {
      const { username, password } = credentials;

      // Buscar empleado por username
      const { data: empleado, error } = await supabase
        .from("empleados")
        .select("id, nombre, username, password_hash, area_id, activo")
        .eq("username", username)
        .eq("activo", true)
        .single();

      if (error || !empleado) {
        throw new Error("Usuario no encontrado o inactivo");
      }

      // Verificar contraseña
      const passwordMatch = await bcrypt.compare(
        password,
        empleado.password_hash
      );
      if (!passwordMatch) {
        throw new Error("Contraseña incorrecta");
      }

      // Actualizar último acceso
      await supabase
        .from("empleados")
        .update({ ultimo_acceso: new Date().toISOString() })
        .eq("id", empleado.id);

      // Mapear a nuestro tipo User
      const user: User = {
        id: empleado.id,
        nombre: empleado.nombre,
        username: empleado.username,
        area_id: empleado.area_id,
        activo: empleado.activo,
        ultimo_acceso: new Date().toISOString(),
      };

      return user;
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    }
  }

  // Verificar si un usuario existe y está activo
  static async checkUserExists(username: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from("empleados")
        .select("username")
        .eq("username", username)
        .eq("activo", true)
        .single();

      return !error && !!data;
    } catch (error) {
      console.error("Error verificando usuario:", error);
      return false;
    }
  }

  // Obtener información del usuario por ID
  static async getUserById(userId: string): Promise<User | null> {
    try {
      const { data: empleado, error } = await supabase
        .from("empleados")
        .select("id, nombre, username, area_id, activo, ultimo_acceso")
        .eq("id", userId)
        .eq("activo", true)
        .single();

      if (error || !empleado) {
        return null;
      }

      return {
        id: empleado.id,
        nombre: empleado.nombre,
        username: empleado.username,
        area_id: empleado.area_id,
        activo: empleado.activo,
        ultimo_acceso: empleado.ultimo_acceso,
      };
    } catch (error) {
      console.error("Error obteniendo usuario:", error);
      return null;
    }
  }

  // Actualizar último acceso del usuario
  static async updateLastAccess(userId: string): Promise<void> {
    try {
      await supabase
        .from("empleados")
        .update({ ultimo_acceso: new Date().toISOString() })
        .eq("id", userId);
    } catch (error) {
      console.error("Error actualizando último acceso:", error);
    }
  }
}
