import { createProvider, LLMStreamPayload } from "@/utils/providers";
import { getSettings } from "@/utils/settings";

export const maxDuration = 60;

async function collectStreamText(stream: ReadableStream): Promise<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let text = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.slice(6));
            text += data.text || "";
          } catch {
            // Skip malformed lines
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  return text;
}

export async function POST(request: Request) {
  const { sources } = await request.json();

  const settingsHeader = request.headers.get("X-StudyBuddy-Settings");
  if (settingsHeader) {
    try {
      const frontendSettings = JSON.parse(settingsHeader);
      const { updateSettings } = await import("@/utils/settings");
      updateSettings(frontendSettings);
    } catch (e) {
      console.warn("Failed to parse frontend settings:", e);
    }
  }

  const settings = getSettings();
  const provider = createProvider();

  const summaries = await Promise.all(
    sources.map(async (source: { name: string; url: string; fullContent: string }) => {
      if (
        !source.fullContent ||
        source.fullContent === "not available" ||
        source.fullContent === "Nothing found"
      ) {
        return source;
      }

      try {
        const payload: LLMStreamPayload = {
          model: settings.llmModel,
          messages: [
            {
              role: "system",
              content:
                "You are a helpful assistant. Summarise the following web page content in 200–300 words, keeping the key facts, concepts, and any definitions. Return only the summary, no preamble.",
            },
            {
              role: "user",
              content: source.fullContent.substring(0, 15000),
            },
          ],
          stream: true,
          temperature: 0.3,
        };

        const stream = await provider.stream(payload);
        const summary = await collectStreamText(stream);

        return {
          ...source,
          fullContent: summary || source.fullContent,
        };
      } catch (e) {
        console.error(`Error summarising ${source.name}:`, e);
        return source;
      }
    }),
  );

  return Response.json(summaries);
}
