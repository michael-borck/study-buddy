import { NextResponse } from "next/server";
import { getProviderBaseUrl } from "@/utils/settings";

// Proxies an Ollama model pull, streaming its NDJSON progress events
// straight back to the client.
export async function POST(request: Request) {
  try {
    const { model, baseUrl } = await request.json();
    if (!model || typeof model !== "string") {
      return NextResponse.json({ error: "No model specified" }, { status: 400 });
    }

    const base = baseUrl || getProviderBaseUrl("ollama");
    const upstream = await fetch(`${base}/api/pull`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: model, stream: true }),
    });

    if (!upstream.ok || !upstream.body) {
      return NextResponse.json(
        { error: `Ollama responded with status ${upstream.status}` },
        { status: 502 },
      );
    }

    return new Response(upstream.body, {
      headers: {
        "Content-Type": "application/x-ndjson",
        "Cache-Control": "no-cache",
      },
    });
  } catch (e) {
    console.error("Model pull failed:", e);
    return NextResponse.json(
      { error: "Could not reach Ollama" },
      { status: 502 },
    );
  }
}
