import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { embedText, retrieveChunks, RetrievedChunk } from "@/lib/rag";
import { chat } from "@/lib/claude";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_MESSAGES = 10;

interface BotConfig {
  id: string;
  bot_name: string;
  persona: string;
  escalation_message: string;
  welcome_message: string;
}

function buildSystemPrompt(config: BotConfig, chunks: RetrievedChunk[]): string {
  const personaInstructions: Record<string, string> = {
    friendly: "Be warm, approachable, and conversational. Use a friendly tone.",
    professional: "Be formal, precise, and professional. Keep responses concise.",
    concise: "Be brief and to the point. Answer in as few words as possible.",
  };

  const persona = personaInstructions[config.persona] ?? personaInstructions.friendly;

  if (chunks.length === 0) {
    return `You are ${config.bot_name}, a helpful support assistant.
${persona}
You have no knowledge base content available.
Say exactly: "I don't have that information yet. ${config.escalation_message}"
Do not make up information.`;
  }

  const knowledgeBase = chunks
    .map((c, i) => `[Source: ${c.source_file}, chunk ${i + 1}]\n${c.content}`)
    .join("\n\n---\n\n");

  return `You are ${config.bot_name}, a helpful support assistant for this business.
${persona}
Answer ONLY based on the following knowledge base content.
If the answer is not in the provided content, say exactly:
"I don't have that information yet. ${config.escalation_message}"
Do not make up information. Do not answer questions outside the provided content.

Knowledge base:
${knowledgeBase}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, session_id } = body as { message: string; session_id: string };

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }
    if (!session_id?.trim()) {
      return NextResponse.json({ error: "session_id is required" }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();

    // ── Rate limiting ───────────────────────────────────────────────────────
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    // Admin bypass
    const adminKey = req.headers.get("x-admin-key") || "";
    const isAdmin = adminKey && adminKey === process.env.ADMIN_SECRET;

    // Simulate block mode — must check BEFORE admin bypass
    if (req.headers.get("x-simulate-block") === "true" && adminKey === process.env.ADMIN_SECRET) {
      return NextResponse.json(
        {
          error: `You've used all ${MAX_MESSAGES} free messages. This is a portfolio demo — reach out for unlimited access!`,
          code: "RATE_LIMIT",
          remaining: 0,
        },
        { status: 429 }
      );
    }

    // Upsert session row
    const { data: session } = await supabase
      .from("sd_sessions")
      .upsert(
        { session_id: session_id.trim(), ip_address: clientIp },
        { onConflict: "session_id" }
      )
      .select()
      .single();

    const currentCount = session?.usage_count ?? 0;

    if (!isAdmin && currentCount >= MAX_MESSAGES) {
      return NextResponse.json(
        {
          error: `You've used all ${MAX_MESSAGES} free messages. This is a portfolio demo — reach out for unlimited access!`,
          code: "RATE_LIMIT",
          remaining: 0,
        },
        { status: 429 }
      );
    }

    // Secondary IP check
    const { data: ipSessions } = await supabase
      .from("sd_sessions")
      .select("usage_count")
      .eq("ip_address", clientIp);

    const totalIpUsage =
      ipSessions?.reduce((sum, s) => sum + (s.usage_count ?? 0), 0) ?? 0;

    if (!isAdmin && totalIpUsage >= MAX_MESSAGES) {
      return NextResponse.json(
        {
          error: `You've used all ${MAX_MESSAGES} free messages. This is a portfolio demo — reach out for unlimited access!`,
          code: "RATE_LIMIT",
          remaining: 0,
        },
        { status: 429 }
      );
    }

    // ── 1. Fetch bot config ─────────────────────────────────────────────────
    const { data: configData, error: configError } = await supabase
      .from("bot_config")
      .select("*")
      .limit(1)
      .single();

    if (configError || !configData) {
      return NextResponse.json({ error: "Bot config not found" }, { status: 500 });
    }
    const config = configData as BotConfig;

    // ── 2. Embed the user message ───────────────────────────────────────────
    const queryEmbedding = await embedText(message);

    // ── 3. Retrieve top 4 relevant chunks ───────────────────────────────────
    const chunks = await retrieveChunks(queryEmbedding, 4);

    // ── 4. Build system prompt and call Claude ──────────────────────────────
    const systemPrompt = buildSystemPrompt(config, chunks);

    const responseText = await chat(systemPrompt, [
      { role: "user", content: message },
    ]);

    // ── 5. Determine confidence score ───────────────────────────────────────
    const wasEscalated = responseText.includes("I don't have that information yet");
    const confidence = wasEscalated ? 0.3 : chunks.length > 0 ? 1.0 : 0.3;

    // ── 6. Store exchange in conversations table ────────────────────────────
    const chunkIds = chunks.map((c) => c.id);

    const { error: insertError } = await supabase.from("conversations").insert([
      {
        session_id,
        role: "user",
        content: message,
        confidence: null,
        retrieved_chunks: null,
      },
      {
        session_id,
        role: "assistant",
        content: responseText,
        confidence,
        retrieved_chunks: chunkIds,
      },
    ]);

    if (insertError) {
      // Non-fatal — still return the response
    }

    // ── 7. Increment usage count ────────────────────────────────────────────
    const newRemaining = MAX_MESSAGES - currentCount - 1;
    await supabase
      .from("sd_sessions")
      .update({ usage_count: currentCount + 1 })
      .eq("session_id", session_id.trim());

    return NextResponse.json({
      response: responseText,
      confidence,
      chunks_used: chunks.length,
      remaining: isAdmin ? 999 : newRemaining,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Chat failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
