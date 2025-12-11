import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import { getPostgreSQLWeek } from "@/app/utils/weekUtils";

export async function POST(request: NextRequest) {
  try {
    const { empleado_id, codigo, proceso, fecha } = await request.json();

    const [year, month, day] = fecha.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    const year_week = getPostgreSQLWeek(date);

    const { data, error } = await supabase
      .from("codigos_trabajo")
      .insert([{ empleado_id, codigo, proceso, fecha, year_week }])
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
    const year_weeks = searchParams.get("year_weeks"); // Ahora recibe múltiples semanas

    let query = supabase.from("codigos_trabajo").select(`
        id,
        codigo,
        proceso,
        fecha,
        year_week,
        empleados!codigos_trabajo_empleado_fkey(nombre)
      `);

    if (empleado_id) {
      query = query.eq("empleado_id", empleado_id);
    }

    if (year_weeks) {
      const weeksArray = year_weeks.split(",");
      query = query.in("year_week", weeksArray);
    }

    const { data, error } = await query.order("creado_en", { ascending: true });

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
