import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    // 🔥 Replace with Qdrant later
    return NextResponse.json({
      results: [`Relevant context for: ${query}`],
    });

  } catch {
    return NextResponse.json({ error: "RAG failed" }, { status: 500 });
  }
}