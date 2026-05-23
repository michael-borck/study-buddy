import { LLMProvider, LLMStreamPayload } from "./types";
import { streamChatCompletion } from "./stream-core";

export class AnthropicProvider implements LLMProvider {
  name = "anthropic";
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string = "https://api.anthropic.com") {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  stream(payload: LLMStreamPayload): Promise<ReadableStream> {
    // Anthropic takes the system message separately from the turn messages.
    const messages = payload.messages.filter((m) => m.role !== "system");
    const system = payload.messages.find((m) => m.role === "system")?.content || "";

    return streamChatCompletion({
      url: `${this.baseUrl}/v1/messages`,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: {
        model: payload.model,
        messages,
        system,
        stream: payload.stream,
        temperature: payload.temperature,
        max_tokens: payload.max_tokens || 2048,
      },
      providerLabel: "Anthropic",
      transport: "lines",
      linePrefix: "data: ",
      readDelta: (j) =>
        j.type === "content_block_delta" && j.delta?.text ? j.delta.text : "",
    });
  }
}
