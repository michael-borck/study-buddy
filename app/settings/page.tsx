"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Settings {
  llmProvider: string;
  llmApiKey: string;
  llmBaseUrl: string;
  llmModel: string;
  searchEngine: string;
  searchApiKey: string;
  searchUrl: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    llmProvider: "ollama",
    llmApiKey: "",
    llmBaseUrl: "",
    llmModel: "",
    searchEngine: "disabled",
    searchApiKey: "",
    searchUrl: "",
  });

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [models, setModels] = useState<string[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // Load from backend first
      const response = await fetch('/api/settings');
      if (response.ok) {
        const backendSettings = await response.json();
        setSettings(backendSettings);
      } else {
        // Fallback to localStorage
        const savedSettings = localStorage.getItem("studybuddy-settings");
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      // Fallback to localStorage
      const savedSettings = localStorage.getItem("studybuddy-settings");
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      // Save to localStorage for persistence
      localStorage.setItem("studybuddy-settings", JSON.stringify(settings));
      
      // Save to backend for immediate use
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings. Please try again.");
    }
  };

  const refreshModels = async () => {
    if (!settings.llmBaseUrl) {
      alert("Please enter a base URL first");
      return;
    }

    setLoadingModels(true);
    try {
      const response = await fetch('/api/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: settings.llmProvider,
          baseUrl: settings.llmBaseUrl,
          apiKey: settings.llmApiKey || undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setModels(data.models || []);
      } else {
        const error = await response.json();
        alert(`Failed to fetch models: ${error.details || error.error}`);
      }
    } catch (error) {
      console.error("Error fetching models:", error);
      alert("Failed to fetch models. Check your connection and settings.");
    } finally {
      setLoadingModels(false);
    }
  };

  const handleReset = () => {
    localStorage.removeItem("studybuddy-settings");
    setSettings({
      llmProvider: "ollama",
      llmApiKey: "",
      llmBaseUrl: "http://localhost:11434",
      llmModel: "llama3.1:8b",
      searchEngine: "disabled",
      searchApiKey: "",
      searchUrl: "",
    });
    setModels([]);
  };

  const llmProviders = [
    { value: "ollama", label: "Ollama (Local)", requiresKey: false },
    { value: "openai", label: "OpenAI", requiresKey: true },
    { value: "anthropic", label: "Anthropic (Claude)", requiresKey: true },
    { value: "google", label: "Google (Gemini)", requiresKey: true },
    { value: "groq", label: "Groq", requiresKey: true },
    { value: "together", label: "Together AI", requiresKey: true },
  ];

  const searchEngines = [
    { value: "disabled", label: "Disabled (No Search)" },
    { value: "searxng", label: "SearXNG (Self-hosted)" },
    { value: "serper", label: "Serper (Google Search API)" },
    { value: "bing", label: "Bing Search API" },
  ];

  const currentProvider = llmProviders.find(p => p.value === settings.llmProvider);
  const currentSearchEngine = searchEngines.find(s => s.value === settings.searchEngine);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>
          
          {/* LLM Provider Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">AI Provider</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Provider
              </label>
              <select
                value={settings.llmProvider}
                onChange={(e) => setSettings({...settings, llmProvider: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {llmProviders.map(provider => (
                  <option key={provider.value} value={provider.value}>
                    {provider.label}
                  </option>
                ))}
              </select>
            </div>

            {(currentProvider?.requiresKey || settings.llmProvider === "ollama") && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key {settings.llmProvider === "ollama" ? "(Optional)" : "(Required)"}
                </label>
                <input
                  type="password"
                  value={settings.llmApiKey}
                  onChange={(e) => setSettings({...settings, llmApiKey: e.target.value})}
                  placeholder={
                    settings.llmProvider === "ollama" 
                      ? "Enter API key if your Ollama requires authentication"
                      : "Enter your API key"
                  }
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {settings.llmProvider === "ollama" && (
                  <p className="text-sm text-gray-500 mt-1">
                    Leave empty for local Ollama. Add if using remote Ollama with authentication.
                  </p>
                )}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base URL (optional)
              </label>
              <input
                type="url"
                value={settings.llmBaseUrl}
                onChange={(e) => setSettings({...settings, llmBaseUrl: e.target.value})}
                placeholder={currentProvider?.value === "ollama" ? "http://localhost:11434" : "Default API URL"}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model
              </label>
              <div className="flex gap-2">
                {models.length > 0 ? (
                  <select
                    value={settings.llmModel}
                    onChange={(e) => setSettings({...settings, llmModel: e.target.value})}
                    className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a model...</option>
                    {models.map(model => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={settings.llmModel}
                    onChange={(e) => setSettings({...settings, llmModel: e.target.value})}
                    placeholder={currentProvider?.value === "ollama" ? "llama3.1:8b" : "Default model"}
                    className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                )}
                <button
                  type="button"
                  onClick={refreshModels}
                  disabled={loadingModels || !settings.llmBaseUrl}
                  className="px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loadingModels ? "..." : "🔄"}
                </button>
              </div>
              {models.length > 0 && (
                <p className="text-sm text-green-600 mt-1">
                  Found {models.length} models. Select one or clear to use custom.
                </p>
              )}
            </div>
          </div>

          {/* Search Engine Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Search Engine</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Provider
              </label>
              <select
                value={settings.searchEngine}
                onChange={(e) => setSettings({...settings, searchEngine: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {searchEngines.map(engine => (
                  <option key={engine.value} value={engine.value}>
                    {engine.label}
                  </option>
                ))}
              </select>
            </div>

            {settings.searchEngine === "searxng" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SearXNG Server URL
                </label>
                <input
                  type="url"
                  value={settings.searchUrl}
                  onChange={(e) => setSettings({...settings, searchUrl: e.target.value})}
                  placeholder="https://your-searxng-server.com"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            {(settings.searchEngine === "serper" || settings.searchEngine === "bing") && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {settings.searchEngine === "serper" ? "Serper API Key" : "Bing API Key"}
                </label>
                <input
                  type="password"
                  value={settings.searchApiKey}
                  onChange={(e) => setSettings({...settings, searchApiKey: e.target.value})}
                  placeholder="Enter your API key"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              {saved ? "✓ Settings Applied!" : "Save & Apply Settings"}
            </button>
            
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Reset to Defaults
            </button>
          </div>

          {saved && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-800">
                ✓ Settings saved and applied! Changes take effect immediately - no restart needed.
              </p>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 p-4 bg-blue-50 rounded-md">
            <h3 className="font-semibold text-blue-900 mb-2">Instructions:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Ollama (Recommended):</strong> Free local AI. Install from <a href="https://ollama.com" target="_blank" rel="noopener noreferrer" className="underline">ollama.com</a></li>
              <li>• <strong>Model Discovery:</strong> Click the 🔄 button to fetch available models from your provider</li>
              <li>• <strong>Cloud Providers:</strong> Require API keys. Create accounts and add your keys above.</li>
              <li>• <strong>Search:</strong> Optional for enriched content. Disabled by default for privacy.</li>
              <li>• <strong>SearXNG:</strong> Self-hosted search engine for privacy-conscious users.</li>
              <li>• <strong>Instant Apply:</strong> Settings take effect immediately - no app restart required!</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}