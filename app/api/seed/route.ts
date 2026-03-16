import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { SEED_CONTENT, SEED_SOURCE } from "@/lib/seed";
import { chunkText, embedBatch, storeChunks } from "@/lib/rag";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST() {
  try {
    const supabase = createServerSupabaseClient();

    // 1. Clear existing chunks from the seed source file
    await supabase
      .from("knowledge_chunks")
      .delete()
      .eq("source_file", SEED_SOURCE);

    // Also clear ALL chunks (full reset for demo)
    await supabase.from("knowledge_chunks").delete().neq("id", "00000000-0000-0000-0000-000000000000");

    // 2. Chunk the seed content
    const chunks = chunkText(SEED_CONTENT);

    // 3. Embed in batches
    const BATCH_SIZE = 128;
    const allEmbeddings: number[][] = [];

    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
      const batch = chunks.slice(i, i + BATCH_SIZE);
      const embeddings = await embedBatch(batch);
      allEmbeddings.push(...embeddings);
    }

    // 4. Store
    const count = await storeChunks(chunks, allEmbeddings, SEED_SOURCE);

    return NextResponse.json({
      success: true,
      message: `Demo data loaded — ${count} chunks from "${SEED_SOURCE}"`,
      chunk_count: count,
    });
  } catch (error) {
    console.error("[seed] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to seed knowledge base",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
