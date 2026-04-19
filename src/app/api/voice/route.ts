import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    return NextResponse.json({
      reply: `Voice response for: ${text}`,
    });

  } catch {
    return NextResponse.json({ error: "Voice failed" }, { status: 500 });
  }
}