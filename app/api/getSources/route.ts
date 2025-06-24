import { NextResponse } from "next/server";
import { z } from "zod";

let excludedSites = ["youtube.com"];
let searchEngine: "bing" | "serper" | "searxng" | "disabled" = process.env.SEARCH_ENGINE as any || "disabled";

export async function POST(request: Request) {
  let { question } = await request.json();

  // If search is disabled, return empty results
  if (searchEngine === "disabled") {
    return NextResponse.json([]);
  }

  const finalQuestion = `what is ${question}`;

  if (searchEngine === "bing") {
    const BING_API_KEY = process.env["BING_API_KEY"];
    if (!BING_API_KEY) {
      throw new Error("BING_API_KEY is required");
    }

    const params = new URLSearchParams({
      q: `${finalQuestion} ${excludedSites.map((site) => `-site:${site}`).join(" ")}`,
      mkt: "en-US",
      count: "6",
      safeSearch: "Strict",
    });

    const response = await fetch(
      `https://api.bing.microsoft.com/v7.0/search?${params}`,
      {
        method: "GET",
        headers: {
          "Ocp-Apim-Subscription-Key": BING_API_KEY,
        },
      },
    );

    const BingJSONSchema = z.object({
      webPages: z.object({
        value: z.array(z.object({ name: z.string(), url: z.string() })),
      }),
    });

    const rawJSON = await response.json();
    const data = BingJSONSchema.parse(rawJSON);

    let results = data.webPages.value.map((result) => ({
      name: result.name,
      url: result.url,
    }));

    return NextResponse.json(results);
    // TODO: Figure out a way to remove certain results like YT
  } else if (searchEngine === "serper") {
    const SERPER_API_KEY = process.env["SERPER_API_KEY"];
    if (!SERPER_API_KEY) {
      throw new Error("SERPER_API_KEY is required");
    }

    const response = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": SERPER_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: finalQuestion,
        num: 9,
      }),
    });

    const rawJSON = await response.json();

    const SerperJSONSchema = z.object({
      organic: z.array(z.object({ title: z.string(), link: z.string() })),
    });

    const data = SerperJSONSchema.parse(rawJSON);

    let results = data.organic.map((result) => ({
      name: result.title,
      url: result.link,
    }));

    return NextResponse.json(results);
  } else if (searchEngine === "searxng") {
    const SEARXNG_URL = process.env.SEARXNG_URL;
    if (!SEARXNG_URL) {
      throw new Error("SEARXNG_URL is required when using SearXNG");
    }

    const params = new URLSearchParams({
      q: finalQuestion,
      format: "json",
      categories: "general",
    });

    const response = await fetch(`${SEARXNG_URL}/search?${params}`, {
      method: "GET",
      headers: {
        "User-Agent": "StudyBuddy/1.0",
      },
    });

    if (!response.ok) {
      console.error(`SearXNG search failed: ${response.status} ${response.statusText}`);
      return NextResponse.json([]);
    }

    const SearXNGJSONSchema = z.object({
      results: z.array(z.object({ 
        title: z.string(), 
        url: z.string(),
        content: z.string().optional()
      })),
    });

    const rawJSON = await response.json();
    const data = SearXNGJSONSchema.parse(rawJSON);

    // Filter out excluded sites and limit results
    let results = data.results
      .filter(result => !excludedSites.some(site => result.url.includes(site)))
      .slice(0, 9)
      .map(result => ({
        name: result.title,
        url: result.url,
      }));

    return NextResponse.json(results);
  }

  // If we get here, search engine is not properly configured
  return NextResponse.json([]);
}
