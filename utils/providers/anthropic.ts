import { LLMProvider, LLMStreamPayload } from "./types";

export class AnthropicProvider implements LLMProvider {
  name = "anthropic";
  private apiKey: string;
  private baseUrl: string;

  constructor(
    apiKey: string,
    baseUrl: string = "https://api.anthropic.com"
  ) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async stream(payload: LLMStreamPayload): Promise<ReadableStream> {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    // Convert messages to Anthropic format
    const anthropicMessages = payload.messages.filter(m => m.role !== 'system');
    const systemMessage = payload.messages.find(m => m.role === 'system')?.content || '';

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "x-api-key": this.apiKey,
      "anthropic-version": "2023-06-01",
    };

    const res = await fetch(`${this.baseUrl}/v1/messages`, {
      headers,
      method: "POST",
      body: JSON.stringify({
        model: payload.model,
        messages: anthropicMessages,
        system: systemMessage,
        stream: payload.stream,
        temperature: payload.temperature,
        max_tokens: payload.max_tokens || 2048,
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
            `Error: received non-200 status code from Anthropic, ${JSON.stringify(data)}`,
          );
          controller.close();
          return;
        }

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
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') {
                  controller.close();
                  return;
                }
                try {
                  const json = JSON.parse(data);
                  if (json.type === 'content_block_delta' && json.delta?.text) {
                    const text = json.delta.text;
                    const payload = { text };
                    controller.enqueue(
                      encoder.encode(`data: ${JSON.stringify(payload)}\n\n`),
                    );
                  }
                } catch (e) {
                  // Skip malformed JSON
                  continue;
                }
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