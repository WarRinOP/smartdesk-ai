import Anthropic from "@anthropic-ai/sdk";

// Server-only — this file must never be imported in client components
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Send a chat request to Claude claude-sonnet-4-6.
 * Used by the RAG pipeline in /api/chat.
 */
export async function chat(
  systemPrompt: string,
  messages: ChatMessage[]
): Promise<string> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  });

  const content = response.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from Claude");
  }

  return content.text;
}
