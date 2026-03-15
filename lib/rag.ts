// Server-only — runs in API routes only, never in client components
// Model: voyage-3-lite | Output dimensions: 512
// voyageai ESM has broken directory imports; use CJS require() like pdf-parse
/* eslint-disable @typescript-eslint/no-require-imports */
import { createServerSupabaseClient } from "./supabase";

interface VoyageEmbedResponse {
  data: Array<{ embedding: number[] }>;
}

interface VoyageClientType {
  embed(opts: {
    model: string;
    input: string[];
    inputType?: "query" | "document";
  }): Promise<VoyageEmbedResponse>;
}

const { VoyageAIClient } = require("voyageai") as {
  VoyageAIClient: new (opts: { apiKey: string }) => VoyageClientType;
};

const voyageClient = new VoyageAIClient({
  apiKey: process.env.VOYAGE_API_KEY!,
});

const EMBED_MODEL = "voyage-3-lite";
const CHUNK_SIZE = 500;
const CHUNK_OVERLAP = 50;

// ─── Embedding ────────────────────────────────────────────

/**
 * Generate a 512-dim embedding for a single text string (query mode).
 */
export async function embedText(text: string): Promise<number[]> {
  const response = await voyageClient.embed({
    model: EMBED_MODEL,
    input: [text],
    inputType: "query",
  });
  return response.data[0].embedding;
}

/**
 * Generate embeddings for multiple texts in a batch (document mode).
 */
export async function embedBatch(texts: string[]): Promise<number[][]> {
  const response = await voyageClient.embed({
    model: EMBED_MODEL,
    input: texts,
    inputType: "document",
  });
  return response.data.map((d) => d.embedding);
}

// ─── Chunking ─────────────────────────────────────────────

/**
 * Split text into overlapping ~CHUNK_SIZE character segments.
 */
export function chunkText(text: string): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + CHUNK_SIZE, text.length);
    chunks.push(text.slice(start, end).trim());
    if (end === text.length) break;
    start += CHUNK_SIZE - CHUNK_OVERLAP;
  }

  return chunks.filter((c) => c.length > 20);
}

// ─── Storage ──────────────────────────────────────────────

/**
 * Store chunks + embeddings in the knowledge_chunks table.
 * Supabase pgvector accepts plain JS number arrays for vector columns.
 */
export async function storeChunks(
  chunks: string[],
  embeddings: number[][],
  sourceFile: string
): Promise<number> {
  const supabase = createServerSupabaseClient();

  const rows = chunks.map((content, i) => ({
    content,
    embedding: embeddings[i] as unknown as string, // pgvector accepts arrays
    source_file: sourceFile,
    chunk_index: i,
  }));

  const { error } = await supabase.from("knowledge_chunks").insert(rows);
  if (error) throw new Error(`Failed to store chunks: ${error.message}`);

  return rows.length;
}

// ─── Retrieval ────────────────────────────────────────────

export interface RetrievedChunk {
  id: string;
  content: string;
  source_file: string;
  similarity: number;
}

/**
 * Find the top-K most similar chunks via the match_chunks Supabase RPC.
 */
export async function retrieveChunks(
  queryEmbedding: number[],
  topK = 4
): Promise<RetrievedChunk[]> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase.rpc("match_chunks", {
    query_embedding: queryEmbedding,
    match_count: topK,
    match_threshold: 0.3,
  });

  if (error) throw new Error(`Retrieval failed: ${error.message}`);
  return (data ?? []) as RetrievedChunk[];
}
