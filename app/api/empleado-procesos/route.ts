import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

interface Proceso {
  id: number;
  nombre: string;
}

interface EmpleadoProcesoResponse {
  proceso_id: number;
  procesos: Proceso | Proceso[] | null;
}

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
    const typedData = data as unknown as EmpleadoProcesoResponse[] | null;

    const procesos =
      typedData
        ?.map((item) => {
          // Manejar tanto si procesos es un objeto como si es un array
          const proceso = Array.isArray(item.procesos)
            ? item.procesos[0]
            : item.procesos;

          return {
            id: proceso?.id,
            nombre: proceso?.nombre,
          };
        })
        .filter((p) => p.id && p.nombre) || [];

    return NextResponse.json(procesos);
  } catch (error) {
    console.error("Error fetching empleado procesos:", error);
    return NextResponse.json(
      { error: "Error al obtener procesos" },
      { status: 500 }
    );
  }
}
