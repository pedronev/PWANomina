import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/app/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    const { data: empleado, error } = await supabase
      .from("empleados")
      .select("id, nombre, username, password_hash, area_id, activo")
      .eq("username", username)
      .eq("activo", true)
      .single();

    if (error || !empleado) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(
      password,
      empleado.password_hash
    );
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Contraseña incorrecta" },
        { status: 401 }
      );
    }

    await supabase
      .from("empleados")
      .update({ ultimo_acceso: new Date().toISOString() })
      .eq("id", empleado.id);

    const user = {
      id: empleado.id,
      nombre: empleado.nombre,
      username: empleado.username,
      area_id: empleado.area_id,
      activo: empleado.activo,
      ultimo_acceso: new Date().toISOString(),
    };

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
