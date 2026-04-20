import { randomUUID } from "crypto";
import { z } from "zod";
import { appendTurn, ensureSession, getSessionTurns } from "@/lib/memory-store";
import { generateDeveloperResponse } from "@/lib/llm";
import { retrieveRelevantContext } from "@/lib/rag";
import { checkRateLimit, getRequestMeta, jsonResponse, logApiError } from "@/lib/api";

export const runtime = "nodejs";

const ChatPayloadSchema = z.object({
  message: z.string().trim().min(1).max(4000),
  sessionId: z.string().trim().max(128).optional(),
});

/**
 * 🔥 Detect if user is asking about legal/contracts
 */
function isLegalQuery(message: string) {
  const text = message.toLowerCase();
  return (
    text.includes("contract") ||
    text.includes("agreement") ||
    text.includes("legal") ||
    text.includes("clause") ||
    text.includes("liability") ||
    text.includes("risk")
  );
}

export async function POST(request: Request) {
  const meta = getRequestMeta(request, "api/chat");

  const limiter = checkRateLimit({
    key: `chat:${meta.ip}`,
    limit: 30,
    windowMs: 60_000,
  });

  if (!limiter.allowed) {
    return jsonResponse(
      {
        error: "Rate limit exceeded.",
        requestId: meta.requestId,
      },
      { status: 429, requestId: meta.requestId, headers: limiter.headers }
    );
  }

  try {
    let rawPayload: unknown;

    try {
      rawPayload = await request.json();
    } catch {
      return jsonResponse(
        { error: "Invalid JSON payload.", requestId: meta.requestId },
        { status: 400, requestId: meta.requestId, headers: limiter.headers }
      );
    }

    const parsed = ChatPayloadSchema.safeParse(rawPayload);
    if (!parsed.success) {
      return jsonResponse(
        {
          error: parsed.error.issues[0]?.message,
          requestId: meta.requestId,
        },
        { status: 400, requestId: meta.requestId, headers: limiter.headers }
      );
    }

    const { message, sessionId } = parsed.data;

    const session = ensureSession(sessionId, message);

    const userTurn = {
      id: randomUUID(),
      role: "user" as const,
      content: message,
      createdAt: new Date().toISOString(),
    };

    appendTurn(session.id, userTurn);

    const contexts = await retrieveRelevantContext(message);
    const history = getSessionTurns(session.id);

    let response;

    /**
     * 🔥 SWITCH: Legal Mode vs Developer Mode
     */
    if (isLegalQuery(message)) {
      response = {
        answer: `⚖️ Legal Analysis:\n\nThis query relates to contract/legal terms. Potential risks may include unclear liability clauses, missing termination conditions, or compliance issues.\n\n👉 Suggestion:\n- Review liability limits\n- Ensure termination clause exists\n- Validate jurisdiction compliance`,
        suggestions: [
          "Analyze full contract",
          "Check risk clauses",
          "Generate safer version",
        ],
      };
    } else {
      // existing developer AI
      response = await generateDeveloperResponse({
        message,
        history,
        context: contexts,
      });
    }

    const assistantTurn = {
      id: randomUUID(),
      role: "assistant" as const,
      content: response.answer,
      createdAt: new Date().toISOString(),
    };

    appendTurn(session.id, assistantTurn);

    return jsonResponse(
      {
        requestId: meta.requestId,
        sessionId: session.id,
        answer: response.answer,
        suggestions: response.suggestions,
        contexts,
      },
      { requestId: meta.requestId, headers: limiter.headers }
    );
  } catch (error) {
    logApiError({
      requestId: meta.requestId,
      route: meta.route,
      error,
    });

    return jsonResponse(
      {
        error: "Failed to process chat request.",
        requestId: meta.requestId,
      },
      { status: 500, requestId: meta.requestId, headers: limiter.headers }
    );
  }
}