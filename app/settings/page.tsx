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
  defaultEducationLevel: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    llmProvider: "ollama",
    llmApiKey: "",
    llmBaseUrl: "",
    llmModel: "",
    searchEngine: "duckduckgo",
    searchApiKey: "",
    searchUrl: "",
    defaultEducationLevel: "Middle School",
  });

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [models, setModels] = useState<string[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [testingSearch, setTestingSearch] = useState(false);
  const [lastTestTime, setLastTestTime] = useState(0);
  const [testResult, setTestResult] = useState<{type: 'success' | 'error' | 'warning', message: string} | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // Load from localStorage first (user's saved settings)
      const savedSettings = localStorage.getItem("studybuddy-settings");
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
      } else {
        // If no localStorage settings, get backend defaults
        const response = await fetch('/api/settings');
        if (response.ok) {
          const backendSettings = await response.json();
          setSettings(backendSettings);
        }
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      // Final fallback to localStorage only
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
        
        // Dispatch custom event to notify other components that settings changed
        window.dispatchEvent(new CustomEvent('settingsChanged'));
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
      setTestResult({
        type: 'error',
        message: 'Please enter a base URL first'
      });
      setTimeout(() => setTestResult(null), 3000);
      return;
    }

    setLoadingModels(true);
    setTestResult(null); // Clear any previous results
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
        if (data.models && data.models.length > 0) {
          setTestResult({
            type: 'success',
            message: `✅ Found ${data.models.length} models from ${settings.llmProvider} server`
          });
          setTimeout(() => setTestResult(null), 3000);
        } else {
          setTestResult({
            type: 'warning',
            message: '⚠️ Connected to server but no models found'
          });
          setTimeout(() => setTestResult(null), 3000);
        }
      } else {
        const error = await response.json();
        setTestResult({
          type: 'error',
          message: `Failed to fetch models: ${error.details || error.error}`
        });
        setTimeout(() => setTestResult(null), 5000);
      }
    } catch (error) {
      console.error("Error fetching models:", error);
      setTestResult({
        type: 'error',
        message: 'Failed to fetch models. Check your connection and settings.'
      });
      setTimeout(() => setTestResult(null), 5000);
    } finally {
      setLoadingModels(false);
    }
  };

  const testSearch = async () => {
    // Prevent rapid clicking (rate limiting)
    const now = Date.now();
    if (now - lastTestTime < 2000) { // 2 second cooldown
      setTestResult({
        type: 'warning',
        message: 'Please wait a moment before testing again.'
      });
      setTimeout(() => setTestResult(null), 2000);
      return;
    }
    setLastTestTime(now);

    if (settings.searchEngine === "disabled") {
      setTestResult({
        type: 'error',
        message: 'Search is disabled. Please select a search engine first.'
      });
      setTimeout(() => setTestResult(null), 3000);
      return;
    }

    if (settings.searchEngine === "searxng" && !settings.searchUrl) {
      setTestResult({
        type: 'error',
        message: 'Please enter a SearXNG server URL first'
      });
      setTimeout(() => setTestResult(null), 3000);
      return;
    }

    if ((settings.searchEngine === "serper" || settings.searchEngine === "bing" || settings.searchEngine === "brave") && !settings.searchApiKey) {
      const engineName = settings.searchEngine === "serper" ? "Serper" : 
                        settings.searchEngine === "bing" ? "Bing" : "Brave";
      setTestResult({
        type: 'error',
        message: `Please enter your ${engineName} API key first`
      });
      setTimeout(() => setTestResult(null), 3000);
      return;
    }

    setTestingSearch(true);
    setTestResult(null); // Clear any previous test results
    try {
      // First, let's test basic connectivity to the server
      if (settings.searchEngine === "searxng") {
        console.log(`Testing SearXNG connectivity to: ${settings.searchUrl}`);
        
        // Try a basic fetch to the root URL first
        try {
          const testUrl = new URL(settings.searchUrl);
          console.log(`Testing basic connectivity to: ${testUrl.origin}`);
          
          const basicTest = await fetch(testUrl.origin, {
            method: 'HEAD',
            mode: 'no-cors', // Avoid CORS issues for basic connectivity test
          });
          console.log('Basic connectivity test completed');
        } catch (basicError) {
          console.warn('Basic connectivity test failed:', basicError);
        }
      }

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      
      // Include current settings in the test
      headers["X-StudyBuddy-Settings"] = JSON.stringify(settings);

      console.log('Sending search test request with settings:', settings.searchEngine, settings.searchUrl);

      const response = await fetch('/api/getSources', {
        method: 'POST',
        headers,
        body: JSON.stringify({ question: "test search query" }),
      });

      if (response.ok) {
        const results = await response.json();
        if (results && results.length > 0) {
          setTestResult({
            type: 'success',
            message: `✅ Search test successful! Found ${results.length} results using ${settings.searchEngine}.`
          });
        } else {
          setTestResult({
            type: 'warning',
            message: '⚠️ Search connected but returned no results. This might be normal for the test query.'
          });
        }
      } else {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Search test failed with response:', response.status, response.statusText, error);
        
        let errorMessage = `Search test failed: ${error.error || response.statusText}`;
        if (error.details) {
          errorMessage += `. Details: ${error.details}`;
        }
        
        setTestResult({
          type: 'error',
          message: errorMessage
        });
      }
    } catch (error) {
      console.error("Search test error:", error);
      let errorMessage = `Search test failed: ${error instanceof Error ? error.message : 'Connection failed'}`;
      
      if (error instanceof Error && error.message.includes('fetch')) {
        errorMessage += '. This might be a network connectivity issue or CORS restriction.';
      }
      
      setTestResult({
        type: 'error',
        message: errorMessage
      });
    } finally {
      setTestingSearch(false);
      // Clear the test result after 5 seconds
      setTimeout(() => setTestResult(null), 5000);
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
      defaultEducationLevel: "Middle School",
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
    { value: "duckduckgo", label: "DuckDuckGo (Free)" },
    { value: "brave", label: "Brave Search API" },
    { value: "serper", label: "Serper (Google Search API)" },
    { value: "bing", label: "Bing Search API" },
    { value: "searxng", label: "SearXNG (Self-hosted)" },
    { value: "disabled", label: "Disabled (No Search)" },
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
                spellCheck={false}
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
                    spellCheck={false}
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

            {settings.searchEngine === "duckduckgo" && (
              <div className="mb-4">
                <p className="text-sm text-green-600 mb-2">✅ DuckDuckGo is free and requires no API key</p>
                <button
                  type="button"
                  onClick={testSearch}
                  disabled={testingSearch}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {testingSearch ? "Testing..." : "🔍 Test DuckDuckGo Search"}
                </button>
              </div>
            )}

            {settings.searchEngine === "searxng" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SearXNG Server URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={settings.searchUrl}
                    onChange={(e) => setSettings({...settings, searchUrl: e.target.value})}
                    placeholder="https://your-searxng-server.com"
                    spellCheck={false}
                    className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={testSearch}
                    disabled={testingSearch || !settings.searchUrl}
                    className="px-4 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {testingSearch ? "..." : "🔍"}
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Click 🔍 to test your SearXNG server connectivity
                </p>
              </div>
            )}

            {(settings.searchEngine === "serper" || settings.searchEngine === "bing" || settings.searchEngine === "brave") && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {settings.searchEngine === "serper" ? "Serper API Key" : 
                   settings.searchEngine === "bing" ? "Bing API Key" :
                   settings.searchEngine === "brave" ? "Brave API Key" : "API Key"}
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={settings.searchApiKey}
                    onChange={(e) => setSettings({...settings, searchApiKey: e.target.value})}
                    placeholder="Enter your API key"
                    className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={testSearch}
                    disabled={testingSearch || !settings.searchApiKey}
                    className="px-4 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {testingSearch ? "..." : "🔍"}
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Click 🔍 to test your {settings.searchEngine === "serper" ? "Serper" : "Bing"} API key
                </p>
              </div>
            )}

          </div>

          {/* Default Education Level Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Default Education Level</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Level for New Conversations
              </label>
              <select
                value={settings.defaultEducationLevel}
                onChange={(e) => setSettings({...settings, defaultEducationLevel: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Elementary School">Elementary School</option>
                <option value="Middle School">Middle School</option>
                <option value="High School">High School</option>
                <option value="College">College</option>
                <option value="Undergrad">Undergrad</option>
                <option value="Graduate">Graduate</option>
              </select>
              <p className="text-sm text-gray-500 mt-1">
                This will be the default level selected when starting a new conversation. You can still change it per conversation.
              </p>
            </div>
          </div>

          {/* Test Result Notification */}
          {testResult && (
            <div className={`mb-4 p-4 rounded-md border ${
              testResult.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
              testResult.type === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
              'bg-red-50 border-red-200 text-red-800'
            }`}>
              <div className="flex justify-between items-start">
                <p className="text-sm">{testResult.message}</p>
                <button
                  onClick={() => setTestResult(null)}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

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