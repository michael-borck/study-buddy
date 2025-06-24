import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";
import { LLMProvider, LLMStreamPayload } from "./types";

export class TogetherProvider implements LLMProvider {
  name = "together";
  private apiKey: string;
  private baseUrl: string;
  private heliconeApiKey?: string;

  constructor(
    apiKey: string,
    baseUrl: string = "https://api.together.xyz",
    heliconeApiKey?: string
  ) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.heliconeApiKey = heliconeApiKey;
  }

  async stream(payload: LLMStreamPayload): Promise<ReadableStream> {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
    };

    if (this.heliconeApiKey) {
      headers["Helicone-Auth"] = `Bearer ${this.heliconeApiKey}`;
      headers["Helicone-Property-AppName"] = "studybuddy";
    }

    const res = await fetch(`${this.baseUrl}/v1/chat/completions`, {
      headers,
      method: "POST",
      body: JSON.stringify({
        model: payload.model,
        messages: payload.messages,
        stream: payload.stream,
        temperature: payload.temperature,
        max_tokens: payload.max_tokens,
      }),
    });

    const readableStream = new ReadableStream({
      async start(controller) {
        const onParse = (event: ParsedEvent | ReconnectInterval) => {
          if (event.type === "event") {
            const data = event.data;
            controller.enqueue(encoder.encode(data));
          }
        };

        if (res.status !== 200) {
          const data = {
            status: res.status,
            statusText: res.statusText,
            body: await res.text(),
          };
          console.log(
            `Error: received non-200 status code from Together AI, ${JSON.stringify(data)}`,
          );
          controller.close();
          return;
        }

        const parser = createParser(onParse);
        for await (const chunk of res.body as any) {
          parser.feed(decoder.decode(chunk));
        }
      },
    });

    let counter = 0;
    const transformStream = new TransformStream({
      async transform(chunk, controller) {
        const data = decoder.decode(chunk);
        if (data === "[DONE]") {
          controller.terminate();
          return;
        }
        try {
          const json = JSON.parse(data);
          const text = json.choices[0].delta?.content || "";
          if (counter < 2 && (text.match(/\n/) || []).length) {
            return;
          }
          const payload = { text: text };
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(payload)}\n\n`),
          );
          counter++;
        } catch (e) {
          controller.error(e);
        }
      },
    });

    return readableStream.pipeThrough(transformStream);
  }
}