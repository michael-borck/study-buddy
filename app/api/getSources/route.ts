import { NextResponse } from "next/server";
import { resolveSettings } from "@/utils/settings";
import { searchWithFallback } from "@/utils/search";

export async function POST(request: Request) {
  const { question } = await request.json();
  const settings = resolveSettings(request);

  const finalQuestion = `what is ${question}`;

  try {
    const outcome = await searchWithFallback(settings, finalQuestion);
    return NextResponse.json(outcome);
  } catch (e: any) {
    console.error("Search chain failed:", e);
    return NextResponse.json(
      { error: e?.message || "Search failed" },
      { status: 500 },
    );
  }
}
