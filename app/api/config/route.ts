import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from("bot_config")
      .select("*")
      .limit(1)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch config", details: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { bot_name, persona, escalation_message, welcome_message } = body as {
      bot_name?: string;
      persona?: string;
      escalation_message?: string;
      welcome_message?: string;
    };

    // Validate persona if provided
    const validPersonas = ["friendly", "professional", "concise"];
    if (persona && !validPersonas.includes(persona)) {
      return NextResponse.json(
        { error: `Persona must be one of: ${validPersonas.join(", ")}` },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();

    // Get the existing config ID first
    const { data: existing, error: fetchError } = await supabase
      .from("bot_config")
      .select("id")
      .limit(1)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: "Config not found" }, { status: 404 });
    }

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (bot_name !== undefined) updates.bot_name = bot_name;
    if (persona !== undefined) updates.persona = persona;
    if (escalation_message !== undefined) updates.escalation_message = escalation_message;
    if (welcome_message !== undefined) updates.welcome_message = welcome_message;

    const { data, error } = await supabase
      .from("bot_config")
      .update(updates)
      .eq("id", existing.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update config", details: String(error) },
      { status: 500 }
    );
  }
}
