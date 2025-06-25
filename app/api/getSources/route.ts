import { NextResponse } from "next/server";
import { z } from "zod";
import { getSettings } from "@/utils/settings";

let excludedSites = ["youtube.com"];

// Enhanced rate limiting - track last request time per URL
const requestTracker = new Map();
const RATE_LIMIT_MS = 2000; // 2 seconds between requests to same URL
const GLOBAL_RATE_LIMIT_MS = 500; // 500ms minimum between any SearXNG requests
let lastGlobalRequest = 0;

export async function POST(request: Request) {
  let { question } = await request.json();

  // Apply frontend settings if provided
  const settingsHeader = request.headers.get('X-StudyBuddy-Settings');
  if (settingsHeader) {
    try {
      const frontendSettings = JSON.parse(settingsHeader);
      const { updateSettings } = await import("@/utils/settings");
      updateSettings(frontendSettings);
      console.log('Applied frontend settings to search:', frontendSettings.searchEngine);
    } catch (e) {
      console.warn('Failed to parse frontend settings for search:', e);
    }
  }
  
  const settings = getSettings();
  const searchEngine = settings.searchEngine as "bing" | "serper" | "searxng" | "duckduckgo" | "brave" | "disabled";
  
  console.log('Using search engine:', searchEngine);

  // If search is disabled, return empty results
  if (searchEngine === "disabled") {
    return NextResponse.json([]);
  }

  // Enhanced rate limiting - prevent rapid requests to SearXNG servers
  if (searchEngine === "searxng") {
    const now = Date.now();
    
    // Global rate limiting across all SearXNG requests
    if (now - lastGlobalRequest < GLOBAL_RATE_LIMIT_MS) {
      const waitTime = GLOBAL_RATE_LIMIT_MS - (now - lastGlobalRequest);
      console.log(`Global rate limiting SearXNG request - waiting ${waitTime}ms`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    // Per-server rate limiting
    const serverKey = settings.searchUrl;
    const lastRequestTime = requestTracker.get(serverKey) || 0;
    const updatedNow = Date.now();
    
    if (updatedNow - lastRequestTime < RATE_LIMIT_MS) {
      const waitTime = RATE_LIMIT_MS - (updatedNow - lastRequestTime);
      console.log(`Server rate limiting SearXNG request - waiting ${waitTime}ms`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    requestTracker.set(serverKey, Date.now());
    lastGlobalRequest = Date.now();
    
    // Clean up old entries (keep only last 50)
    if (requestTracker.size > 50) {
      const entries = Array.from(requestTracker.entries());
      requestTracker.clear();
      entries.slice(-25).forEach(([key, time]) => requestTracker.set(key, time));
    }
  }

  const finalQuestion = `what is ${question}`;

  if (searchEngine === "bing") {
    const BING_API_KEY = settings.searchApiKey;
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
    const SERPER_API_KEY = settings.searchApiKey;
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
    const SEARXNG_URL = settings.searchUrl;
    if (!SEARXNG_URL) {
      throw new Error("SEARXNG_URL is required when using SearXNG");
    }

    const params = new URLSearchParams({
      q: finalQuestion,
      format: "json",
      category_general: "1", // Use individual category params like working URLs
      language: "auto",
      time_range: "",
      safesearch: "2", // Moderate safe search
      theme: "simple",
    });

    console.log(`Attempting SearXNG search to: ${SEARXNG_URL}/search?${params}`);

    const requestHeaders = {
      "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "application/json, text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Accept-Encoding": "gzip, deflate, br, zstd",
      "Connection": "keep-alive",
      "Referer": SEARXNG_URL, // Add referer to appear more legitimate
      "Sec-Ch-Ua": '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
      "Sec-Ch-Ua-Mobile": "?0",
      "Sec-Ch-Ua-Platform": '"Linux"',
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "same-origin", // Changed from "none" since we're making a search request
      "Sec-Fetch-User": "?1",
      "Upgrade-Insecure-Requests": "1",
    };

    let response;
    let lastError;
    
    // Try multiple endpoints with exponential backoff for 429 errors
    const endpoints = ['/search', '/'];
    
    for (let i = 0; i < endpoints.length; i++) {
      const endpoint = endpoints[i];
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount <= maxRetries) {
        try {
          const url = `${SEARXNG_URL}${endpoint}?${params}`;
          console.log(`Trying SearXNG endpoint: ${url} (attempt ${retryCount + 1})`);
          
          // Add randomized delay before request (except first attempt)
          if (retryCount > 0) {
            const delay = Math.min(1000 * Math.pow(2, retryCount - 1) + Math.random() * 1000, 8000);
            console.log(`Waiting ${delay}ms before retry...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
          
          response = await fetch(url, {
            method: "GET",
            headers: requestHeaders,
            signal: AbortSignal.timeout(15000),
          });

          if (response.ok) {
            console.log(`✅ SearXNG request successful with endpoint: ${endpoint}`);
            break; // Success, exit both loops
          } else if (response.status === 429 && retryCount < maxRetries) {
            console.warn(`❌ SearXNG ${endpoint} rate limited (429), retrying...`);
            retryCount++;
            continue; // Retry this endpoint
          } else {
            console.warn(`❌ SearXNG ${endpoint} failed: ${response.status} ${response.statusText}`);
            lastError = { status: response.status, statusText: response.statusText, endpoint };
            break; // Try next endpoint
          }
        } catch (fetchError: any) {
          console.error(`❌ SearXNG ${endpoint} error:`, fetchError);
          lastError = fetchError;
          if (retryCount < maxRetries && (fetchError.name === 'TimeoutError' || fetchError.code === 'EAI_AGAIN')) {
            retryCount++;
            continue; // Retry on timeout/network issues
          }
          break; // Try next endpoint on other errors
        }
      }
      
      if (response && response.ok) {
        break; // Success, exit endpoint loop
      }
      response = null; // Reset for next endpoint
    }

    // If all endpoints failed
    if (!response) {
      console.error("All SearXNG endpoints failed");
      
      if (lastError && lastError.status) {
        return NextResponse.json({ 
          error: `SearXNG server returned ${lastError.status}: ${lastError.statusText}. Tried both /search and / endpoints.` 
        }, { status: 500 });
      }
      
      // Handle other types of errors
      if (lastError) {
        console.error("Final error details:", {
          name: lastError.name,
          message: lastError.message,
          code: lastError.code,
          cause: lastError.cause
        });
        
        if (lastError.name === 'TimeoutError') {
          return NextResponse.json({ error: "SearXNG server timeout. Please check if the server is running and accessible." }, { status: 500 });
        }
        
        if (lastError.code === 'EAI_AGAIN' || lastError.code === 'ENOTFOUND') {
          return NextResponse.json({ error: `Cannot connect to SearXNG server at "${SEARXNG_URL}". Please check the URL and ensure the server is accessible.` }, { status: 500 });
        }
        
        // Check for specific error types
        if (lastError.message && (lastError.message.includes('certificate') || lastError.message.includes('SSL') || lastError.message.includes('TLS'))) {
          return NextResponse.json({ error: `SSL/TLS certificate error connecting to "${SEARXNG_URL}". The server may have an invalid certificate.` }, { status: 500 });
        }
        
        if (lastError.message && lastError.message.includes('CORS')) {
          return NextResponse.json({ error: `CORS error connecting to "${SEARXNG_URL}". The server may not allow cross-origin requests.` }, { status: 500 });
        }
        
        return NextResponse.json({ 
          error: `SearXNG connection failed: ${lastError.message || 'Unknown error'}. Tried both /search and / endpoints.`,
          details: `Error type: ${lastError.name || 'unknown'}, Code: ${lastError.code || 'none'}`
        }, { status: 500 });
      }
      
      return NextResponse.json({ error: "SearXNG connection failed with unknown error" }, { status: 500 });
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
  } else if (searchEngine === "duckduckgo") {
    // DuckDuckGo HTML search scraping - Free, no API key required
    const params = new URLSearchParams({
      q: finalQuestion,
      t: "h_", // Use lite version
      ia: "web" // Web results only
    });

    console.log(`Attempting DuckDuckGo search: https://lite.duckduckgo.com/lite/?${params}`);

    try {
      const response = await fetch(`https://lite.duckduckgo.com/lite/?${params}`, {
        method: "GET",
        headers: {
          "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          "Accept-Encoding": "gzip, deflate, br",
          "DNT": "1",
          "Connection": "keep-alive",
          "Upgrade-Insecure-Requests": "1",
        },
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        console.error(`DuckDuckGo search failed: ${response.status} ${response.statusText}`);
        return NextResponse.json({ error: `DuckDuckGo search failed: ${response.statusText}` }, { status: 500 });
      }

      const htmlText = await response.text();
      console.log('DuckDuckGo HTML response received, length:', htmlText.length);
      console.log('First 500 chars of response:', htmlText.substring(0, 500));

      // Parse HTML to extract search results
      const results = [];
      
      // Look for result links in the lite version format
      // DuckDuckGo Lite uses redirect URLs with the actual URL in the uddg parameter
      const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*class=['"]result-link['"][^>]*>([^<]+)<\/a>/gi;
      const matches = Array.from(htmlText.matchAll(linkRegex));
      
      for (const match of matches) {
        let url = match[1];
        const title = match[2].trim();
        
        // Extract actual URL from DuckDuckGo redirect
        if (url.includes('duckduckgo.com/l/?uddg=')) {
          const uddgMatch = url.match(/uddg=([^&]+)/);
          if (uddgMatch) {
            try {
              url = decodeURIComponent(uddgMatch[1]);
            } catch (e) {
              console.warn('Failed to decode DuckDuckGo URL:', uddgMatch[1]);
              continue;
            }
          }
        }
        
        // Filter out navigation and unwanted results
        if (
          url.startsWith('http') && 
          !url.includes('/?q=') &&
          !url.includes('/settings') &&
          title.length > 10 &&
          !title.toLowerCase().includes('duckduckgo') &&
          !title.toLowerCase().includes('next page') &&
          !excludedSites.some(site => url.includes(site))
        ) {
          results.push({
            name: title.substring(0, 200),
            url: url
          });
          
          if (results.length >= 9) break; // Limit to 9 results
        }
      }

      console.log(`DuckDuckGo returned ${results.length} results`);
      return NextResponse.json(results);

    } catch (error: any) {
      console.error("DuckDuckGo search error:", error);
      return NextResponse.json({ 
        error: `DuckDuckGo search failed: ${error.message || 'Network error'}` 
      }, { status: 500 });
    }
  } else if (searchEngine === "brave") {
    const BRAVE_API_KEY = settings.searchApiKey;
    if (!BRAVE_API_KEY) {
      return NextResponse.json({ error: "Brave Search API key is required" }, { status: 400 });
    }

    console.log('Attempting Brave Search API request');

    try {
      const params = new URLSearchParams({
        q: finalQuestion,
        count: "9",
        text_decorations: "false",
        search_lang: "en",
        country: "US",
        safesearch: "moderate"
      });

      const response = await fetch(`https://api.search.brave.com/res/v1/web/search?${params}`, {
        method: "GET",
        headers: {
          "X-Subscription-Token": BRAVE_API_KEY,
          "Accept": "application/json",
          "User-Agent": "StudyBuddy/1.0"
        },
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        console.error(`Brave Search API failed: ${response.status} ${response.statusText}`);
        return NextResponse.json({ 
          error: `Brave Search failed: ${response.status} ${response.statusText}` 
        }, { status: 500 });
      }

      const rawJSON = await response.json();
      console.log('Brave Search response received');

      const BraveJSONSchema = z.object({
        web: z.object({
          results: z.array(z.object({ 
            title: z.string(), 
            url: z.string() 
          }))
        })
      });

      const data = BraveJSONSchema.parse(rawJSON);

      let results = data.web.results
        .filter(result => !excludedSites.some(site => result.url.includes(site)))
        .slice(0, 9)
        .map(result => ({
          name: result.title,
          url: result.url,
        }));

      console.log(`Brave Search returned ${results.length} results`);
      return NextResponse.json(results);

    } catch (error: any) {
      console.error("Brave Search error:", error);
      if (error.name === 'ZodError') {
        console.error("Brave Search response format error:", error.errors);
        return NextResponse.json({ error: "Brave Search returned unexpected response format" }, { status: 500 });
      }
      return NextResponse.json({ 
        error: `Brave Search failed: ${error.message || 'Network error'}` 
      }, { status: 500 });
    }
  }

  // If we get here, search engine is not properly configured
  return NextResponse.json([]);
}
