import { config, hasExternalLlmConfig } from "@/lib/config";
import { ChatTurn, RetrievedChunk } from "@/lib/types";
import { mockDeveloperAnswer } from "@/lib/mock";

/**
 * 🔥 STRONG PROMPT BUILDER
 */
function buildPrompt(params: {
  message: string;
  history: ChatTurn[];
  context: RetrievedChunk[];
}) {
  const historyText = params.history
    .slice(-6)
    .map((t) => `${t.role}: ${t.content}`)
    .join("\n");

  const contextText = params.context
    .slice(0, config.maxContextChunks)
    .map((c, i) => `[${i + 1}] ${c.text}`)
    .join("\n");

  return `
You are DevVoice — an expert AI assistant for developers AND legal contract analysis.

Rules:
- Be concise, structured, and practical
- If coding → explain + fix + example
- If legal → identify risks + clauses + suggestions
- Always return structured output

Format:
SUMMARY:
...
RISKS:
- ...
SUGGESTIONS:
- ...

Conversation:
${historyText || "none"}

Context:
${contextText || "none"}

User:
${params.message}
`;
}

type OpenAIResponse = {
  choices?: Array<{ message?: { content?: string } }>;
  error?: { message?: string };
};

async function callOpenAI(params: {
  message: string;
  history: ChatTurn[];
  context: RetrievedChunk[];
}) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.openAiApiKey}`,
    },
    body: JSON.stringify({
      model: config.llmModel,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "You are a highly intelligent AI for coding + legal reasoning.",
        },
        {
          role: "user",
          content: buildPrompt(params),
        },
      ],
    }),
  });

  const data = (await res.json()) as OpenAIResponse;

  if (!res.ok) {
    throw new Error(data.error?.message || "OpenAI error");
  }

  return data.choices?.[0]?.message?.content || "";
}

/**
 * 🚀 MAIN FUNCTION
 */
export async function generateDeveloperResponse(params: {
  message: string;
  history: ChatTurn[];
  context: RetrievedChunk[];
}): Promise<{ answer: string; suggestions: string[] }> {
console.log("ENV MOCK_MODE:", process.env.MOCK_MODE);
console.log("ENV OPENAI KEY EXISTS:", !!process.env.OPENAI_API_KEY);

  if (!hasExternalLlmConfig()) {
  return mockDeveloperAnswer(params.message);
}

  try {
    const answer = await callOpenAI(params);

    return {
      answer,
      suggestions: [
        "Explain deeper with example",
        "Give step-by-step fix",
        "Show real-world use case",
      ],
    };
  } catch (err) {
    console.error("❌ OpenAI failed:", err);

    const fallback = mockDeveloperAnswer(params.message);

    return {
      answer:
        fallback.answer +
        "\n\n⚠️ AI fallback triggered. Check API key / billing.",
      suggestions: [
        "Check API key",
        "Verify billing",
        "Try different model",
      ],
    };
  }
}