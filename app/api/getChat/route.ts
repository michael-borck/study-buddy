import {
  createProvider,
  getDefaultProviderConfig,
  LLMStreamPayload,
} from "@/utils/providers";

export async function POST(request: Request) {
  let { messages } = await request.json();

  try {
    const providerConfig = getDefaultProviderConfig();
    const provider = createProvider(providerConfig);
    
    const payload: LLMStreamPayload = {
      model: providerConfig.defaultModel,
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
