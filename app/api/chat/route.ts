import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { embedText, retrieveChunks, RetrievedChunk } from "@/lib/rag";
import { chat } from "@/lib/claude";

export const runtime = "nodejs";
export const maxDuration = 60;

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

    // 1. Fetch bot config
    const { data: configData, error: configError } = await supabase
      .from("bot_config")
      .select("*")
      .limit(1)
      .single();

    if (configError || !configData) {
      return NextResponse.json({ error: "Bot config not found" }, { status: 500 });
    }
    const config = configData as BotConfig;

    // 2. Embed the user message
    const queryEmbedding = await embedText(message);

    // 3. Retrieve top 4 relevant chunks
    const chunks = await retrieveChunks(queryEmbedding, 4);

    // 4. Build system prompt and call Claude
    const systemPrompt = buildSystemPrompt(config, chunks);

    const responseText = await chat(systemPrompt, [
      { role: "user", content: message },
    ]);

    // 5. Determine confidence score
    const wasEscalated = responseText.includes("I don't have that information yet");
    const confidence = wasEscalated ? 0.3 : chunks.length > 0 ? 1.0 : 0.3;

    // 6. Store exchange in conversations table
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
      console.error("[chat] Failed to store conversation:", insertError.message);
      // Non-fatal — still return the response
    }

    return NextResponse.json({
      response: responseText,
      confidence,
      chunks_used: chunks.length,
    });
  } catch (error) {
    console.error("[chat] Error:", error);
    return NextResponse.json(
      {
        error: "Chat failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
