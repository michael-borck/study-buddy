import {
  createProvider,
  LLMStreamPayload,
} from "@/utils/providers";
import { resolveSettings } from "@/utils/settings";

export async function POST(request: Request) {
  let { messages } = await request.json();

  try {
    const settings = resolveSettings(request);
    const provider = createProvider(settings);

    const payload: LLMStreamPayload = {
      model: settings.llmModel,
      messages,
      stream: true,
    };

    const stream = await provider.stream(payload);

    return new Response(stream, {
      headers: new Headers({
        "Cache-Control": "no-cache",
      }),
    });
  } catch (e) {
    console.error("LLM stream error:", e);
    return new Response(
      JSON.stringify({
        error: "Could not reach the AI model",
        details: e instanceof Error ? e.message : "Unknown error",
      }),
      { status: 502, headers: { "Content-Type": "application/json" } },
    );
  }
}

export const runtime = "edge";
