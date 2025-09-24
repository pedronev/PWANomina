import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { empleado_id, codigo, proceso, fecha } = await request.json();

    const { data, error } = await supabase
      .from("codigos_trabajo")
      .insert([
        {
          empleado_id,
          codigo,
          proceso,
          fecha,
        },
      ])
      .select();

    if (error) throw error;
    return NextResponse.json(data[0]);
  } catch (error) {
    console.error("Error saving codigo:", error);
    return NextResponse.json(
      { error: "Error al guardar código" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const empleado_id = searchParams.get("empleado_id");
    const year_week = searchParams.get("year_week");
    const procesado = searchParams.get("procesado");

    let query = supabase.from("codigos_trabajo").select(`
        id,
        codigo,
        proceso,
        fecha,
        year_week,
        procesado,
        empleados!codigos_trabajo_empleado_fkey(nombre)
      `);

    if (empleado_id) {
      query = query.eq("empleado_id", empleado_id);
    }

    // if (empleado_nombre) {
    //   // Buscar empleado por nombre primero
    //   const { data: empleadoData } = await supabase
    //     .from("empleados")
    //     .select("id")
    //     .eq("nombre", empleado_nombre)
    //     .single();

    //   if (empleadoData) {
    //     query = query.eq("empleado_id", empleadoData.id);
    //   } else {
    //     return NextResponse.json([]);
    //   }
    // }

    if (year_week) {
      query = query.eq("year_week", year_week);
    }

    if (procesado !== null) {
      query = query.eq("procesado", procesado === "true");
    }

    const { data, error } = await query.order("creado_en", {
      ascending: false,
    });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching codigos:", error);
    return NextResponse.json(
      { error: "Error al obtener códigos" },
      { status: 500 }
    );
  }
}
