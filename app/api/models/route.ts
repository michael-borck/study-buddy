import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { provider, baseUrl, apiKey } = await request.json();
    
    let models: string[] = [];
    
    switch (provider.toLowerCase()) {
      case "ollama":
        models = await getOllamaModels(baseUrl, apiKey);
        break;
      case "openai":
        models = await getOpenAIModels(baseUrl, apiKey);
        break;
      case "anthropic":
      case "claude":
        models = getAnthropicModels();
        break;
      case "google":
      case "gemini":
        models = await getGoogleModels(baseUrl, apiKey);
        break;
      case "groq":
        models = await getGroqModels(baseUrl, apiKey);
        break;
      case "together":
        models = await getTogetherModels(baseUrl, apiKey);
        break;
      default:
        return NextResponse.json({ error: "Unsupported provider" }, { status: 400 });
    }
    
    return NextResponse.json({ models });
  } catch (error) {
    console.error("Error fetching models:", error);
    return NextResponse.json({ 
      error: "Failed to fetch models", 
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

async function getOllamaModels(baseUrl: string, apiKey?: string): Promise<string[]> {
  const url = `${baseUrl}/api/tags`;
  const headers: Record<string, string> = {};
  
  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }
  
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.models?.map((model: any) => model.name) || [];
}

async function getOpenAIModels(baseUrl: string, apiKey: string): Promise<string[]> {
  const response = await fetch(`${baseUrl}/v1/models`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });
  
  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.data?.map((model: any) => model.id) || [];
}

function getAnthropicModels(): string[] {
  return [
    "claude-3-5-sonnet-20241022",
    "claude-3-5-haiku-20241022", 
    "claude-3-opus-20240229",
    "claude-3-sonnet-20240229",
    "claude-3-haiku-20240307"
  ];
}

async function getGoogleModels(baseUrl: string, apiKey: string): Promise<string[]> {
  const response = await fetch(`${baseUrl}/v1beta/models?key=${apiKey}`);
  
  if (!response.ok) {
    throw new Error(`Google API error: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.models?.map((model: any) => model.name.replace('models/', '')) || [];
}

async function getGroqModels(baseUrl: string, apiKey: string): Promise<string[]> {
  const response = await fetch(`${baseUrl}/v1/models`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });
  
  if (!response.ok) {
    throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.data?.map((model: any) => model.id) || [];
}

async function getTogetherModels(baseUrl: string, apiKey: string): Promise<string[]> {
  const response = await fetch(`${baseUrl}/v1/models`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });
  
  if (!response.ok) {
    throw new Error(`Together API error: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.data?.map((model: any) => model.id) || [];
}