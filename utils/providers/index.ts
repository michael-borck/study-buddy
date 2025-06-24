import { OllamaProvider } from "./ollama";
import { TogetherProvider } from "./together";
import { LLMProvider, ProviderConfig } from "./types";

export * from "./types";
export { OllamaProvider } from "./ollama";
export { TogetherProvider } from "./together";

export function createProvider(config: ProviderConfig): LLMProvider {
  switch (config.name.toLowerCase()) {
    case "ollama":
      return new OllamaProvider(config.baseUrl);
    case "together":
      if (!config.apiKey) {
        throw new Error("Together AI requires an API key");
      }
      return new TogetherProvider(
        config.apiKey,
        config.baseUrl,
        process.env.HELICONE_API_KEY
      );
    default:
      throw new Error(`Unsupported provider: ${config.name}`);
  }
}

export function getDefaultProviderConfig(): ProviderConfig {
  // Default to Ollama for local development
  const provider = process.env.LLM_PROVIDER || "ollama";
  
  switch (provider.toLowerCase()) {
    case "ollama":
      return {
        name: "ollama",
        baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
        defaultModel: process.env.OLLAMA_MODEL || "llama3.1:8b",
      };
    case "together":
      return {
        name: "together",
        apiKey: process.env.TOGETHER_API_KEY,
        baseUrl: process.env.HELICONE_API_KEY 
          ? "https://together.helicone.ai"
          : "https://api.together.xyz",
        defaultModel: process.env.TOGETHER_MODEL || "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
      };
    default:
      // Fallback to Ollama
      return {
        name: "ollama",
        baseUrl: "http://localhost:11434",
        defaultModel: "llama3.1:8b",
      };
  }
}