import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    // 🔥 MOCK (for now)
    const summary = "This is a sample contract summary.";

    const risks = [
      "Clause 4 has unlimited liability",
      "No termination clause defined",
    ];

    const suggestions = [
      "Add termination clause",
      "Limit liability to fixed amount",
    ];

    return NextResponse.json({
      summary,
      risks,
      suggestions,
    });

  } catch {
    return NextResponse.json(
      { error: "Analysis failed" },
      { status: 500 }
    );
  }
}