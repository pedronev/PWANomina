import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { empleado_id, codigo, proceso, fecha } = await request.json();

    const getPostgreSQLWeek = (dateString: string): string => {
      const [year, month, day] = dateString.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      const currentDay = date.getDay();

      // Calcular el viernes de la semana actual (viernes a jueves)
      const friday = new Date(date);
      if (currentDay >= 5) {
        // Si es viernes (5) o sábado (6), retroceder al viernes
        friday.setDate(date.getDate() - (currentDay - 5));
      } else {
        // Si es domingo (0) a jueves (4), retroceder al viernes anterior
        friday.setDate(date.getDate() - (currentDay + 2));
      }

      // Calcular el primer viernes del año
      const yearStart = new Date(friday.getFullYear(), 0, 1);
      const firstFriday = new Date(yearStart);
      const startDay = yearStart.getDay();

      if (startDay <= 5) {
        firstFriday.setDate(yearStart.getDate() + (5 - startDay));
      } else {
        firstFriday.setDate(yearStart.getDate() + (12 - startDay));
      }

      // Calcular número de semana
      const weekNumber =
        Math.floor(
          (friday.getTime() - firstFriday.getTime()) / (7 * 24 * 60 * 60 * 1000)
        ) + 1;

      return `${friday.getFullYear()}-W${weekNumber
        .toString()
        .padStart(2, "0")}`;
    };

    const year_week = getPostgreSQLWeek(fecha);

    const { data, error } = await supabase
      .from("codigos_trabajo")
      .insert([
        {
          empleado_id,
          codigo,
          proceso,
          fecha,
          year_week,
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

    const { data, error } = await query.order("creado_en", {
      ascending: true,
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
