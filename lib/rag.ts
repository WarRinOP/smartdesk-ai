// Server-only — runs in API routes only, never in client components
// Embeddings: Jina AI jina-embeddings-v3 | 512 dimensions
// Uses fetch (no SDK needed — Jina has a clean REST API)
import { createServerSupabaseClient } from "./supabase";

const JINA_API_KEY = process.env.JINA_API_KEY!;
const JINA_API_URL = "https://api.jina.ai/v1/embeddings";
const EMBED_MODEL = "jina-embeddings-v3";
const EMBED_DIMS = 512;

const CHUNK_SIZE = 500;
const CHUNK_OVERLAP = 50;

// ─── Jina Embedding Helpers ───────────────────────────────

interface JinaEmbedResponse {
  data: Array<{ embedding: number[] }>;
}

async function jinaEmbed(
  inputs: string[],
  task: "retrieval.query" | "retrieval.passage"
): Promise<number[][]> {
  const res = await fetch(JINA_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${JINA_API_KEY}`,
    },
    body: JSON.stringify({
      model: EMBED_MODEL,
      input: inputs,
      dimensions: EMBED_DIMS,
      task,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Jina AI error ${res.status}: ${body}`);
  }

  const json = (await res.json()) as JinaEmbedResponse;
  return json.data.map((d) => d.embedding);
}

// ─── Public Embedding Functions ───────────────────────────

/**
 * Generate a 512-dim embedding for a single query string.
 * Uses task="retrieval.query" for optimal query-side embeddings.
 */
export async function embedText(text: string): Promise<number[]> {
  const results = await jinaEmbed([text], "retrieval.query");
  return results[0];
}

/**
 * Generate embeddings for multiple document chunks (batch).
 * Uses task="retrieval.passage" for optimal document-side embeddings.
 */
export async function embedBatch(texts: string[]): Promise<number[][]> {
  return jinaEmbed(texts, "retrieval.passage");
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
 * Store chunks + their embeddings in the knowledge_chunks table.
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
