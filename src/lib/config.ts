export const config = {
  appName: "DevVoice",

  // ✅ robust mock handling
  mockMode:
    String(process.env.MOCK_MODE).trim().toLowerCase() === "true",

  openAiApiKey: process.env.OPENAI_API_KEY?.trim(),
  llmModel: process.env.LLM_MODEL ?? "gpt-4o-mini",

  // ✅ Qdrant (restore this)
  qdrantUrl: process.env.QDRANT_URL,
  qdrantApiKey: process.env.QDRANT_API_KEY,
  qdrantCollection: process.env.QDRANT_COLLECTION ?? "devvoice_context",

  maxContextChunks: Number(process.env.MAX_CONTEXT_CHUNKS ?? 6),
};

export function hasExternalLlmConfig() {
  return (
    !config.mockMode &&
    typeof config.openAiApiKey === "string" &&
    config.openAiApiKey.startsWith("sk-")
  );
}

// ✅ FIX YOUR ERROR HERE
export function hasQdrantConfig() {
  return Boolean(config.qdrantUrl);
}