export type ChatRole = "user" | "system" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface LLMStreamPayload {
  model: string;
  messages: ChatMessage[];
  stream: boolean;
  temperature?: number;
  max_tokens?: number;
}

export interface LLMProvider {
  name: string;
  stream(payload: LLMStreamPayload): Promise<ReadableStream>;
}

export interface ProviderConfig {
  name: string;
  apiKey?: string;
  baseUrl?: string;
  defaultModel: string;
}