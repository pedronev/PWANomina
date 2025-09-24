import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { codigo_id, nueva_fecha } = await request.json();

    if (!codigo_id || !nueva_fecha) {
      return NextResponse.json(
        { error: "codigo_id y nueva_fecha son requeridos" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("codigos_trabajo")
      .update({ fecha: nueva_fecha })
      .eq("id", codigo_id)
      .select();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      updated: data?.[0] || null,
    });
  } catch (error) {
    console.error("Error updating fecha:", error);
    return NextResponse.json(
      { error: "Error al actualizar fecha" },
      { status: 500 }
    );
  }
}
