const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "qwen2.5:7b";
const OPENAI_API_BASE = process.env.OPENAI_API_BASE || "https://api.openai.com/v1";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_SYNTHESIS_MODEL =
  process.env.OPENAI_SYNTHESIS_MODEL || "gpt-5.1-chat-latest";

export function getSynthesisProvider(): "openai" | "ollama" {
  const configured = process.env.SYNTHESIS_PROVIDER;
  if (configured === "openai" || configured === "ollama") {
    return configured;
  }
  return OPENAI_API_KEY ? "openai" : "ollama";
}

export function getSynthesisModelName(): string {
  return getSynthesisProvider() === "openai"
    ? OPENAI_SYNTHESIS_MODEL
    : OLLAMA_MODEL;
}

export async function generateSynthesisText(prompt: string): Promise<string> {
  return getSynthesisProvider() === "openai"
    ? generateWithOpenAI(prompt)
    : generateWithOllama(prompt);
}

async function generateWithOpenAI(prompt: string): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key is missing. Set OPENAI_API_KEY.");
  }

  const res = await fetch(`${OPENAI_API_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_SYNTHESIS_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI error (${res.status}): ${text}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;

  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    const textContent = content
      .map((item) => (typeof item?.text === "string" ? item.text : ""))
      .join("")
      .trim();
    if (textContent) return textContent;
  }

  throw new Error("OpenAI returned an empty completion");
}

async function generateWithOllama(prompt: string): Promise<string> {
  const res = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt,
      stream: false,
      options: {
        temperature: 0.3,
        num_predict: 4096,
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Ollama error (${res.status}): ${text}`);
  }

  const data: { response?: string } = await res.json();
  if (!data.response) {
    throw new Error("Ollama returned an empty response");
  }
  return data.response;
}

export function parseLLMJSON<T>(response: string): T {
  let jsonStr = response.trim();
  if (jsonStr.startsWith("```")) {
    jsonStr = jsonStr
      .replace(/^```(?:json)?\n?/, "")
      .replace(/\n?```$/, "");
  }
  return JSON.parse(jsonStr);
}
