// Shared streaming core for LLM providers.
//
// Every provider does the same three things — POST a request, handle a non-200,
// and normalise the upstream stream into `data: {"text": "..."}\n\n` chunks for
// the client. The only real differences are the request (url/headers/body), the
// wire framing (OpenAI-style SSE vs newline-delimited JSON), and how to read a
// text delta out of one parsed chunk. This module owns the common work; each
// adapter supplies just those differences.

import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";

export interface StreamChatOptions {
  url: string;
  headers: Record<string, string>;
  body: unknown;
  /** Used only in the non-200 log line, e.g. "OpenAI". */
  providerLabel: string;
  /** "sse" for OpenAI-compatible event streams; "lines" for newline-delimited JSON. */
  transport: "sse" | "lines";
  /** Pull the text delta out of one parsed chunk. Return "" when there is none. */
  readDelta: (json: any) => string;
  /** "lines" only: process only lines starting with this prefix, stripped before parsing (e.g. "data: "). */
  linePrefix?: string;
  /** "lines" only: end the stream when this returns true for a parsed chunk. */
  isDone?: (json: any) => boolean;
  /** "sse" only: drop newline-only deltas until two real chunks have been emitted (OpenAI quirk). */
  skipLeadingNewlines?: boolean;
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function emit(controller: ReadableStreamDefaultController, text: string) {
  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
}

async function logNon200(res: Response, label: string) {
  const data = {
    status: res.status,
    statusText: res.statusText,
    body: await res.text(),
  };
  console.log(
    `Error: received non-200 status code from ${label}, ${JSON.stringify(data)}`,
  );
}

export async function streamChatCompletion(
  opts: StreamChatOptions,
): Promise<ReadableStream> {
  const res = await fetch(opts.url, {
    method: "POST",
    headers: opts.headers,
    body: JSON.stringify(opts.body),
  });

  return opts.transport === "sse" ? sseStream(res, opts) : lineStream(res, opts);
}

function sseStream(res: Response, opts: StreamChatOptions): ReadableStream {
  return new ReadableStream({
    async start(controller) {
      if (res.status !== 200) {
        await logNon200(res, opts.providerLabel);
        controller.close();
        return;
      }

      let finished = false;
      let counter = 0;
      const parser = createParser((event: ParsedEvent | ReconnectInterval) => {
        if (finished || event.type !== "event") return;
        const data = event.data;
        if (data === "[DONE]") {
          finished = true;
          controller.close();
          return;
        }
        try {
          const text = opts.readDelta(JSON.parse(data));
          if (
            opts.skipLeadingNewlines &&
            counter < 2 &&
            (text.match(/\n/) || []).length
          ) {
            return;
          }
          emit(controller, text);
          counter++;
        } catch (e) {
          finished = true;
          controller.error(e);
        }
      });

      for await (const chunk of res.body as any) {
        if (finished) break;
        parser.feed(decoder.decode(chunk));
      }
      if (!finished) controller.close();
    },
  });
}

function lineStream(res: Response, opts: StreamChatOptions): ReadableStream {
  return new ReadableStream({
    async start(controller) {
      if (res.status !== 200) {
        await logNon200(res, opts.providerLabel);
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

          const lines = decoder
            .decode(value)
            .split("\n")
            .filter((line) => line.trim());

          for (const line of lines) {
            let payload = line;
            if (opts.linePrefix) {
              if (!line.startsWith(opts.linePrefix)) continue;
              payload = line.slice(opts.linePrefix.length);
            }
            if (payload === "[DONE]") {
              controller.close();
              return;
            }
            try {
              const json = JSON.parse(payload);
              const text = opts.readDelta(json);
              if (text) emit(controller, text);
              if (opts.isDone?.(json)) {
                controller.close();
                return;
              }
            } catch {
              // Skip malformed lines.
              continue;
            }
          }
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      } finally {
        reader.releaseLock();
      }
    },
  });
}
