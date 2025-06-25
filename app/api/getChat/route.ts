import {
  createProvider,
  LLMStreamPayload,
} from "@/utils/providers";
import { getSettings } from "@/utils/settings";

export async function POST(request: Request) {
  let { messages } = await request.json();

  try {
    const settings = getSettings();
    const provider = createProvider(); // Will use runtime settings
    
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
    return new Response("Error. Answer stream failed.", { status: 202 });
  }
}

export const runtime = "edge";
