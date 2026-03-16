import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { SEED_DOCS } from "@/lib/seed";
import { chunkText, embedBatch, storeChunks } from "@/lib/rag";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST() {
  try {
    const supabase = createServerSupabaseClient();

    // 1. Clear ALL existing knowledge chunks (full reset for demo)
    await supabase
      .from("knowledge_chunks")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");

    let totalChunks = 0;

    // 2. Process each NovaTech document
    for (const doc of SEED_DOCS) {
      const chunks = chunkText(doc.content);

      // Embed in batches
      const BATCH_SIZE = 128;
      const allEmbeddings: number[][] = [];

      for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
        const batch = chunks.slice(i, i + BATCH_SIZE);
        const embeddings = await embedBatch(batch);
        allEmbeddings.push(...embeddings);
      }

      // Store
      const count = await storeChunks(chunks, allEmbeddings, doc.sourceFile);
      totalChunks += count;
    }

    return NextResponse.json({
      success: true,
      message: `Demo data loaded — ${totalChunks} chunks from ${SEED_DOCS.length} NovaTech documents`,
      chunk_count: totalChunks,
      documents: SEED_DOCS.map((d) => d.sourceFile),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to seed knowledge base",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
