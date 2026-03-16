import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();

    // Unique session count
    const { data: sessionsData } = await supabase
      .from("conversations")
      .select("session_id")
      .eq("role", "assistant");

    const totalConversations = new Set(
      (sessionsData ?? []).map((s) => s.session_id)
    ).size;

    // Confidence stats
    const { data: confidenceData } = await supabase
      .from("conversations")
      .select("confidence")
      .eq("role", "assistant")
      .not("confidence", "is", null);

    const confidences = (confidenceData ?? [])
      .map((c) => c.confidence as number)
      .filter((c) => c !== null);

    const avgConfidence =
      confidences.length > 0
        ? confidences.reduce((a, b) => a + b, 0) / confidences.length
        : 0;

    const lowConfidenceCount = confidences.filter((c) => c < 0.5).length;
    const lowConfidencePct =
      confidences.length > 0
        ? Math.round((lowConfidenceCount / confidences.length) * 100)
        : 0;

    // Chunk count
    const { count: chunkCount } = await supabase
      .from("knowledge_chunks")
      .select("*", { count: "exact", head: true });

    return NextResponse.json({
      total_conversations: totalConversations,
      avg_confidence: Math.round(avgConfidence * 100) / 100,
      low_confidence_pct: lowConfidencePct,
      chunk_count: chunkCount ?? 0,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch stats", details: String(error) },
      { status: 500 }
    );
  }
}
