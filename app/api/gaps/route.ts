import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { chat } from "@/lib/claude";
import { reserveQuota, GuardConfig } from "@/lib/usage-guard";

// Clustering calls Claude, so it has its own small per-device budget.
const GUARD: GuardConfig = { prefix: "sd", limit: 3, noun: "gap reports", scope: "gaps" };
const MAX_QUESTIONS = 100;
const MAX_QUESTION_CHARS = 300;

export const runtime = "nodejs";
export const maxDuration = 60;

interface GapQuestion {
  cluster_label: string;
  count: number;
  example_messages: string[];
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    const supabase = createServerSupabaseClient();

    // Fetch session IDs where assistant had low confidence
    let lowConfQuery = supabase
      .from("conversations")
      .select("session_id")
      .eq("role", "assistant")
      .lt("confidence", 0.5)
      .limit(200);

    if (sessionId) {
      lowConfQuery = lowConfQuery.eq("session_id", sessionId);
    }

    const { data: lowConfidenceAssistant, error } = await lowConfQuery;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const lowSessionIds = [
      ...new Set((lowConfidenceAssistant ?? []).map((m) => m.session_id)),
    ];

    if (lowSessionIds.length === 0) {
      return NextResponse.json({
        gaps: [],
        total_low_confidence: 0,
        message: "No knowledge gaps found. All questions are being answered well!",
      });
    }

    // Get the user messages from those sessions
    const { data: userMessages } = await supabase
      .from("conversations")
      .select("content, session_id, created_at")
      .eq("role", "user")
      .in("session_id", lowSessionIds)
      .order("created_at", { ascending: false });

    const questions = (userMessages ?? [])
      .map((m) => String(m.content ?? "").slice(0, MAX_QUESTION_CHARS))
      .filter(Boolean)
      .slice(0, MAX_QUESTIONS);

    if (questions.length === 0) {
      return NextResponse.json({ gaps: [], total_low_confidence: 0 });
    }

    // 2. Use Claude to cluster similar questions
    const clusterPrompt = `You are analyzing customer support questions that a chatbot couldn't answer.
Group these ${questions.length} questions into 5-10 clusters of similar topics.
For each cluster, provide:
- A short label (3-6 words) describing the topic
- The count of questions in that cluster

Return ONLY valid JSON in this exact format:
{
  "clusters": [
    {
      "label": "Opening hours and schedule",
      "questions": [0, 3, 7]
    }
  ]
}

Use the question index numbers (0-based) to assign questions to clusters.
Sort by size descending (most questions first).

Questions:
${questions.map((q, i) => `${i}: "${q}"`).join("\n")}`;

    let gaps: GapQuestion[] = [];

    // Only call Claude when the visitor still has budget; otherwise return the raw list.
    const reservation = await reserveQuota(req, supabase, GUARD);

    try {
      if (!reservation.ok) throw new Error("no budget");
      const clusterResponse = await chat(clusterPrompt, [
        { role: "user", content: "Cluster these questions and return only the JSON." },
      ]);

      // Extract JSON from response
      const jsonMatch = clusterResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]) as {
          clusters: Array<{ label: string; questions: number[] }>;
        };

        gaps = parsed.clusters.map((cluster) => ({
          cluster_label: cluster.label,
          count: cluster.questions.length,
          example_messages: cluster.questions
            .slice(0, 3)
            .map((idx) => questions[idx])
            .filter(Boolean),
        }));
      }
    } catch {
      // Fallback: return raw questions without clustering
      if (reservation.ok) await reservation.refund();
      gaps = [
        {
          cluster_label: "Unanswered questions",
          count: questions.length,
          example_messages: questions.slice(0, 5),
        },
      ];
    }

    return NextResponse.json({
      gaps,
      total_low_confidence: lowSessionIds.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate gap report", details: String(error) },
      { status: 500 }
    );
  }
}
