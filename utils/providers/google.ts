import { LLMProvider, LLMStreamPayload } from "./types";

export class GoogleProvider implements LLMProvider {
  name = "google";
  private apiKey: string;
  private baseUrl: string;

  constructor(
    apiKey: string,
    baseUrl: string = "https://generativelanguage.googleapis.com"
  ) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async stream(payload: LLMStreamPayload): Promise<ReadableStream> {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    // Convert messages to Google format
    const contents = payload.messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : msg.role,
      parts: [{ text: msg.content }]
    }));

    const res = await fetch(`${this.baseUrl}/v1beta/models/${payload.model}:streamGenerateContent?key=${this.apiKey}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: payload.temperature,
          maxOutputTokens: payload.max_tokens,
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
            `Error: received non-200 status code from Google, ${JSON.stringify(data)}`,
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
                try {
                  const json = JSON.parse(data);
                  const text = json.candidates?.[0]?.content?.parts?.[0]?.text || "";
                  
                  if (text) {
                    const payload = { text };
                    controller.enqueue(
                      encoder.encode(`data: ${JSON.stringify(payload)}\n\n`),
                    );
                  }

                  if (json.candidates?.[0]?.finishReason) {
                    controller.close();
                    return;
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