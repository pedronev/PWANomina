import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const empleado_id = searchParams.get("empleado_id");

    if (!empleado_id) {
      return NextResponse.json(
        { error: "empleado_id es requerido" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("empleado_procesos")
      .select("proceso_id, procesos(id, nombre)")
      .eq("empleado_id", empleado_id);

    if (error) throw error;

    const procesos =
      data?.map((item) => ({
        id: item.procesos.id,
        nombre: item.procesos.nombre,
      })) || [];

    return NextResponse.json(procesos);
  } catch (error) {
    console.error("Error fetching empleado procesos:", error);
    return NextResponse.json(
      { error: "Error al obtener procesos" },
      { status: 500 }
    );
  }
}
