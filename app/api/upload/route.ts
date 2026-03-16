import { NextRequest, NextResponse } from "next/server";
import { parsePdf, parseTxt } from "@/lib/pdf";
import { chunkText, embedBatch, storeChunks } from "@/lib/rag";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const fileName = file.name.toLowerCase();
    const isPdf = fileName.endsWith(".pdf");
    const isTxt = fileName.endsWith(".txt");

    if (!isPdf && !isTxt) {
      return NextResponse.json(
        { error: "Only PDF and .txt files are supported" },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File exceeds 10MB limit" },
        { status: 400 }
      );
    }

    // Parse text from file
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const text = isPdf ? await parsePdf(buffer) : parseTxt(buffer);

    if (!text || text.trim().length < 50) {
      return NextResponse.json(
        { error: "Could not extract meaningful text from file" },
        { status: 400 }
      );
    }

    // Chunk the text
    const chunks = chunkText(text);

    if (chunks.length === 0) {
      return NextResponse.json(
        { error: "No text chunks could be generated" },
        { status: 400 }
      );
    }

    // Generate embeddings in batches of 128
    const BATCH_SIZE = 128;
    const allEmbeddings: number[][] = [];

    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
      const batch = chunks.slice(i, i + BATCH_SIZE);
      const embeddings = await embedBatch(batch);
      allEmbeddings.push(...embeddings);
    }

    // Store in Supabase
    const chunkCount = await storeChunks(chunks, allEmbeddings, file.name);

    return NextResponse.json({
      success: true,
      source_file: file.name,
      chunk_count: chunkCount,
      message: `Successfully processed ${chunkCount} chunks from "${file.name}"`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Upload failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
