import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export const runtime = "nodejs";

// GET /api/chunks — list all source files with chunk counts
export async function GET() {
  try {
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from("knowledge_chunks")
      .select("source_file, created_at")
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Group by source_file
    const fileMap = new Map<
      string,
      { source_file: string; chunk_count: number; created_at: string }
    >();

    for (const row of data ?? []) {
      const existing = fileMap.get(row.source_file);
      if (existing) {
        existing.chunk_count += 1;
        // Keep earliest created_at
        if (row.created_at < existing.created_at) {
          existing.created_at = row.created_at;
        }
      } else {
        fileMap.set(row.source_file, {
          source_file: row.source_file,
          chunk_count: 1,
          created_at: row.created_at,
        });
      }
    }

    // Sort by most recent first
    const files = Array.from(fileMap.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return NextResponse.json({ files });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// DELETE /api/chunks?source_file=filename.txt — remove all chunks for a file
export async function DELETE(req: NextRequest) {
  // Block deletion in demo mode
  if (process.env.DEMO_MODE === "true") {
    return NextResponse.json(
      { error: "Deletion disabled in demo mode." },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const sourceFile = searchParams.get("source_file");

    if (!sourceFile) {
      return NextResponse.json({ error: "source_file param required" }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();

    const { error, count } = await supabase
      .from("knowledge_chunks")
      .delete({ count: "exact" })
      .eq("source_file", sourceFile);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({
      success: true,
      deleted_count: count ?? 0,
      source_file: sourceFile,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// GET /api/chunks/preview?source_file=filename.txt — first 3 chunks
export async function POST(req: NextRequest) {
  try {
    const { source_file } = await req.json() as { source_file: string };

    if (!source_file) {
      return NextResponse.json({ error: "source_file required" }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from("knowledge_chunks")
      .select("id, content, chunk_index")
      .eq("source_file", source_file)
      .order("chunk_index", { ascending: true })
      .limit(3);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ chunks: data ?? [] });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
