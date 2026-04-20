import { randomUUID } from "crypto";
import { z } from "zod";
import { generateDeveloperResponse } from "@/lib/llm";

export const runtime = "nodejs";

const schema = z.object({
  message: z.string().min(1),
  sessionId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { message } = parsed.data;

    // 👉 SIMPLE SAFE CALL
    const response = await generateDeveloperResponse({
      message,
      history: [],
      context: [],
    });

    return Response.json({
      sessionId: randomUUID(),
      answer: response.answer,
      suggestions: response.suggestions,
      contexts: [],
    });
  } catch (err) {
    console.error("❌ API ERROR:", err);

    return Response.json(
      {
        error: "Server crashed",
        details: String(err),
      },
      { status: 500 }
    );
  }
}