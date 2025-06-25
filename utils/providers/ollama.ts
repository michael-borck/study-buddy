import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";
import { LLMProvider, LLMStreamPayload } from "./types";

export class OllamaProvider implements LLMProvider {
  name = "ollama";
  private baseUrl: string;
  private apiKey?: string;

  constructor(baseUrl: string = "http://localhost:11434", apiKey?: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  async stream(payload: LLMStreamPayload): Promise<ReadableStream> {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.apiKey) {
      headers.Authorization = `Bearer ${this.apiKey}`;
    }

    const res = await fetch(`${this.baseUrl}/api/chat`, {
      headers,
      method: "POST",
      body: JSON.stringify({
        model: payload.model,
        messages: payload.messages,
        stream: payload.stream,
        options: {
          temperature: payload.temperature ?? 0.7,
          num_predict: payload.max_tokens ?? 2048,
        },
      }),
    });

    const readableStream = new ReadableStream({
      async start(controller) {
        if (res.status !== 200) {
          const data = {
            status: res.status,
            statusText: res.statusText,
            body: await res.text(),
          };
          console.log(
            `Error: received non-200 status code from Ollama, ${JSON.stringify(data)}`,
          );
          controller.close();
          return;
        }

        // Ollama streams JSONL responses
        const reader = res.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n').filter(line => line.trim());

            for (const line of lines) {
              try {
                const json = JSON.parse(line);
                const text = json.message?.content || "";
                
                if (text) {
                  const payload = { text };
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify(payload)}\n\n`),
                  );
                }

                if (json.done) {
                  controller.close();
                  return;
                }
              } catch (e) {
                // Skip malformed JSON lines
                continue;
              }
            }
          }
        } catch (error) {
          controller.error(error);
        } finally {
          reader.releaseLock();
        }
      },
    });

    return readableStream;
  }
}