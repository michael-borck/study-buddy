import { NextResponse } from "next/server";
import { resolveSettings } from "@/utils/settings";
import { createSearchProvider } from "@/utils/search";

export async function POST(request: Request) {
  const { question } = await request.json();
  const settings = resolveSettings(request);

  // No adapter => search disabled or unknown engine => no results.
  const provider = createSearchProvider(settings);
  if (!provider) {
    return NextResponse.json([]);
  }

  const finalQuestion = `what is ${question}`;

  try {
    const results = await provider.search(finalQuestion);
    return NextResponse.json(results);
  } catch (e: any) {
    console.error(`${provider.name} search failed:`, e);
    return NextResponse.json(
      { error: e?.message || "Search failed" },
      { status: 500 },
    );
  }
}
