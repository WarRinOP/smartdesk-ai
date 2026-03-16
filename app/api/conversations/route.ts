import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export const runtime = "nodejs";

const PAGE_SIZE = 20;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const filter = searchParams.get("filter"); // "high" | "low" | null
    const sessionId = searchParams.get("session_id");

    const supabase = createServerSupabaseClient();

    // If fetching a specific session's full conversation thread
    if (sessionId) {
      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true });

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ messages: data });
    }

    // Aggregate sessions — get distinct session_ids with metadata
    // We'll fetch all assistant messages and group them by session
    let query = supabase
      .from("conversations")
      .select("*")
      .eq("role", "assistant")
      .order("created_at", { ascending: false });

    // Confidence filters
    if (filter === "high") {
      query = query.gte("confidence", 0.7);
    } else if (filter === "low") {
      query = query.lt("confidence", 0.5);
    }

    const { data: allAssistantMsgs, error } = await query;

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Group by session_id to get unique sessions with their latest activity
    const sessionMap = new Map<string, {
      session_id: string;
      message_count: number;
      avg_confidence: number;
      last_active: string;
    }>();

    for (const msg of allAssistantMsgs ?? []) {
      const existing = sessionMap.get(msg.session_id);
      if (existing) {
        existing.message_count += 1;
        existing.avg_confidence =
          (existing.avg_confidence * (existing.message_count - 1) + (msg.confidence ?? 0)) /
          existing.message_count;
      } else {
        sessionMap.set(msg.session_id, {
          session_id: msg.session_id,
          message_count: 1,
          avg_confidence: msg.confidence ?? 0,
          last_active: msg.created_at,
        });
      }
    }

    // Get the first user message for each session as the preview
    const sessions = Array.from(sessionMap.values());
    const sessionIds = sessions.map((s) => s.session_id);

    const { data: firstMessages } = await supabase
      .from("conversations")
      .select("session_id, content, created_at")
      .eq("role", "user")
      .in("session_id", sessionIds)
      .order("created_at", { ascending: true });

    const firstMsgMap = new Map<string, string>();
    for (const msg of firstMessages ?? []) {
      if (!firstMsgMap.has(msg.session_id)) {
        firstMsgMap.set(msg.session_id, msg.content);
      }
    }

    // Paginate
    const total = sessions.length;
    const offset = (page - 1) * PAGE_SIZE;
    const paginated = sessions.slice(offset, offset + PAGE_SIZE).map((s) => ({
      ...s,
      first_message: firstMsgMap.get(s.session_id) ?? "",
      avg_confidence: Math.round(s.avg_confidence * 100) / 100,
    }));

    return NextResponse.json({
      sessions: paginated,
      total,
      page,
      page_size: PAGE_SIZE,
      total_pages: Math.ceil(total / PAGE_SIZE),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch conversations", details: String(error) },
      { status: 500 }
    );
  }
}
