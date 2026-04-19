import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    return NextResponse.json({
      summary: "This is a sample contract summary",
      risks: ["Clause 4 risky", "Missing termination clause"],
      suggestions: ["Add termination clause", "Limit liability"],
    });

  } catch {
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}