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

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem("studybuddy-settings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("studybuddy-settings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    
    // Show restart message
    alert("Settings saved! Please restart the app for changes to take effect.");
  };

  const handleReset = () => {
    localStorage.removeItem("studybuddy-settings");
    setSettings({
      llmProvider: "ollama",
      llmApiKey: "",
      llmBaseUrl: "",
      llmModel: "",
      searchEngine: "disabled",
      searchApiKey: "",
      searchUrl: "",
    });
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

            {currentProvider?.requiresKey && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key
                </label>
                <input
                  type="password"
                  value={settings.llmApiKey}
                  onChange={(e) => setSettings({...settings, llmApiKey: e.target.value})}
                  placeholder="Enter your API key"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
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
                Model (optional)
              </label>
              <input
                type="text"
                value={settings.llmModel}
                onChange={(e) => setSettings({...settings, llmModel: e.target.value})}
                placeholder={currentProvider?.value === "ollama" ? "llama3.1:8b" : "Default model"}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
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
              {saved ? "✓ Saved!" : "Save Settings"}
            </button>
            
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Reset to Defaults
            </button>
          </div>

          {/* Instructions */}
          <div className="mt-8 p-4 bg-blue-50 rounded-md">
            <h3 className="font-semibold text-blue-900 mb-2">Instructions:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Ollama (Recommended):</strong> Free local AI. Install from <a href="https://ollama.com" target="_blank" rel="noopener noreferrer" className="underline">ollama.com</a></li>
              <li>• <strong>Cloud Providers:</strong> Require API keys. Create accounts and add your keys above.</li>
              <li>• <strong>Search:</strong> Optional for enriched content. Disabled by default for privacy.</li>
              <li>• <strong>SearXNG:</strong> Self-hosted search engine for privacy-conscious users.</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}