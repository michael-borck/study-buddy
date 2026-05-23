import { LLMProvider, LLMStreamPayload } from "./types";
import { streamChatCompletion } from "./stream-core";

export class GoogleProvider implements LLMProvider {
  name = "google";
  private apiKey: string;
  private baseUrl: string;

  constructor(
    apiKey: string,
    baseUrl: string = "https://generativelanguage.googleapis.com",
  ) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  stream(payload: LLMStreamPayload): Promise<ReadableStream> {
    const contents = payload.messages.map((m) => ({
      role: m.role === "assistant" ? "model" : m.role,
      parts: [{ text: m.content }],
    }));

    return streamChatCompletion({
      url: `${this.baseUrl}/v1beta/models/${payload.model}:streamGenerateContent?key=${this.apiKey}`,
      headers: { "Content-Type": "application/json" },
      body: {
        contents,
        generationConfig: {
          temperature: payload.temperature,
          maxOutputTokens: payload.max_tokens,
        },
      },
      providerLabel: "Google",
      transport: "lines",
      linePrefix: "data: ",
      readDelta: (j) => j.candidates?.[0]?.content?.parts?.[0]?.text || "",
      isDone: (j) => !!j.candidates?.[0]?.finishReason,
    });
  }
}
