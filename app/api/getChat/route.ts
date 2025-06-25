import {
  createProvider,
  LLMStreamPayload,
} from "@/utils/providers";
import { getSettings } from "@/utils/settings";

export async function POST(request: Request) {
  let { messages } = await request.json();

  try {
    // First, try to get settings from request headers (if frontend sends them)
    const settingsHeader = request.headers.get('X-StudyBuddy-Settings');
    if (settingsHeader) {
      try {
        const frontendSettings = JSON.parse(settingsHeader);
        const { updateSettings } = await import("@/utils/settings");
        updateSettings(frontendSettings);
        console.log('Applied frontend settings:', frontendSettings.llmProvider);
      } catch (e) {
        console.warn('Failed to parse frontend settings:', e);
      }
    }
    
    const settings = getSettings();
    console.log('Using settings:', { 
      provider: settings.llmProvider, 
      baseUrl: settings.llmBaseUrl, 
      model: settings.llmModel,
      hasApiKey: !!settings.llmApiKey 
    });
    
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
