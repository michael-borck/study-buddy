import { LLMProvider, LLMStreamPayload } from "./types";
import { streamChatCompletion } from "./stream-core";

export class TogetherProvider implements LLMProvider {
  name = "together";
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string = "https://api.together.xyz") {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  stream(payload: LLMStreamPayload): Promise<ReadableStream> {
    return streamChatCompletion({
      url: `${this.baseUrl}/v1/chat/completions`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: {
        model: payload.model,
        messages: payload.messages,
        stream: payload.stream,
        temperature: payload.temperature,
        max_tokens: payload.max_tokens,
      },
      providerLabel: "Together AI",
      transport: "sse",
      skipLeadingNewlines: true,
      readDelta: (j) => j.choices?.[0]?.delta?.content || "",
    });
  }
}
