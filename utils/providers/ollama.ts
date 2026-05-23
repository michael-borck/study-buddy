import { LLMProvider, LLMStreamPayload } from "./types";
import { streamChatCompletion } from "./stream-core";

export class OllamaProvider implements LLMProvider {
  name = "ollama";
  private baseUrl: string;
  private apiKey?: string;

  constructor(baseUrl: string = "http://localhost:11434", apiKey?: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  stream(payload: LLMStreamPayload): Promise<ReadableStream> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (this.apiKey) {
      headers.Authorization = `Bearer ${this.apiKey}`;
    }

    return streamChatCompletion({
      url: `${this.baseUrl}/api/chat`,
      headers,
      body: {
        model: payload.model,
        messages: payload.messages,
        stream: payload.stream,
        options: {
          temperature: payload.temperature ?? 0.7,
          num_predict: payload.max_tokens ?? 2048,
        },
      },
      providerLabel: "Ollama",
      // Ollama streams newline-delimited JSON (no "data:" prefix).
      transport: "lines",
      readDelta: (j) => j.message?.content || "",
      isDone: (j) => !!j.done,
    });
  }
}
