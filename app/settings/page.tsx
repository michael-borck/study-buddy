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
      const savedSettings = localStorage.getItem("studybuddy-settings");
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
      } else {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const backendSettings = await response.json();
          setSettings(backendSettings);
        }
      }
    } catch (error) {
      console.error("Error loading settings:", error);
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
      localStorage.setItem("studybuddy-settings", JSON.stringify(settings));

      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
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
        message: 'Please enter a server address first'
      });
      setTimeout(() => setTestResult(null), 3000);
      return;
    }

    setLoadingModels(true);
    setTestResult(null);
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
            message: `Found ${data.models.length} models from ${settings.llmProvider} server`
          });
          setTimeout(() => setTestResult(null), 3000);
        } else {
          setTestResult({
            type: 'warning',
            message: 'Connected to server but no models found'
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
    const now = Date.now();
    if (now - lastTestTime < 2000) {
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
        message: 'Please enter a search server address first'
      });
      setTimeout(() => setTestResult(null), 3000);
      return;
    }

    if ((settings.searchEngine === "serper" || settings.searchEngine === "bing" || settings.searchEngine === "brave") && !settings.searchApiKey) {
      const engineName = settings.searchEngine === "serper" ? "Serper" :
                        settings.searchEngine === "bing" ? "Bing" : "Brave";
      setTestResult({
        type: 'error',
        message: `Please enter your ${engineName} secret key first`
      });
      setTimeout(() => setTestResult(null), 3000);
      return;
    }

    setTestingSearch(true);
    setTestResult(null);
    try {
      if (settings.searchEngine === "searxng") {
        console.log(`Testing SearXNG connectivity to: ${settings.searchUrl}`);
        try {
          const testUrl = new URL(settings.searchUrl);
          console.log(`Testing basic connectivity to: ${testUrl.origin}`);
          const basicTest = await fetch(testUrl.origin, {
            method: 'HEAD',
            mode: 'no-cors',
          });
          console.log('Basic connectivity test completed');
        } catch (basicError) {
          console.warn('Basic connectivity test failed:', basicError);
        }
      }

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
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
            message: `Search test successful! Found ${results.length} results using ${settings.searchEngine}.`
          });
        } else {
          setTestResult({
            type: 'warning',
            message: 'Search connected but returned no results. This might be normal for the test query.'
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
        errorMessage += '. This might be a network connectivity issue.';
      }

      setTestResult({
        type: 'error',
        message: errorMessage
      });
    } finally {
      setTestingSearch(false);
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
    { value: "brave", label: "Brave Search" },
    { value: "serper", label: "Serper (Google Search)" },
    { value: "bing", label: "Bing Search" },
    { value: "searxng", label: "SearXNG (Self-hosted)" },
    { value: "disabled", label: "Disabled (No Search)" },
  ];

  const currentProvider = llmProviders.find(p => p.value === settings.llmProvider);

  const inputClasses = "w-full rounded-soft border border-hairline bg-paper p-3 text-ink transition-colors duration-normal placeholder:text-ink-quiet hover:border-hairline-strong focus:border-accent focus:outline-none focus:ring-[3px] focus:ring-accent-soft";
  const labelClasses = "block text-xs font-medium uppercase tracking-widest text-ink-quiet mb-2";

  if (loading) {
    return (
      <div className="min-h-screen bg-paper">
        <Header />
        <main className="container mx-auto max-w-4xl px-4 py-8">
          <div className="rounded-soft border border-hairline p-6">
            <div className="animate-pulse">
              <div className="mb-6 h-8 w-1/4 rounded-soft bg-ink/10"></div>
              <div className="space-y-4">
                <div className="h-4 w-3/4 rounded-soft bg-ink/10"></div>
                <div className="h-4 w-1/2 rounded-soft bg-ink/10"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      <Header />

      <main className="container mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-soft border border-hairline p-8">
          <h1 className="text-3xl font-semibold text-ink mb-8">Settings</h1>

          {/* AI Provider Section */}
          <div className="mb-10">
            <div className="flex items-center mb-6">
              <span className="inline-block h-px w-9 bg-accent mr-3"></span>
              <span className="text-xs font-medium uppercase tracking-widest text-ink-muted">
                AI Provider
              </span>
            </div>

            <div className="mb-4">
              <label className={labelClasses}>
                Provider
              </label>
              <select
                value={settings.llmProvider}
                onChange={(e) => setSettings({...settings, llmProvider: e.target.value})}
                className={inputClasses}
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
                <label className={labelClasses}>
                  Secret key {settings.llmProvider === "ollama" ? "(Optional)" : "(Required)"}
                </label>
                <input
                  type="password"
                  value={settings.llmApiKey}
                  onChange={(e) => setSettings({...settings, llmApiKey: e.target.value})}
                  placeholder={
                    settings.llmProvider === "ollama"
                      ? "Enter secret key if your Ollama requires it"
                      : "Enter your secret key"
                  }
                  className={inputClasses}
                />
                {settings.llmProvider === "ollama" && (
                  <p className="mt-1 text-sm text-ink-quiet">
                    Leave empty for local Ollama. Add if using remote Ollama with authentication.
                  </p>
                )}
              </div>
            )}

            <div className="mb-4">
              <label className={labelClasses}>
                Server address (optional)
              </label>
              <input
                type="url"
                value={settings.llmBaseUrl}
                onChange={(e) => setSettings({...settings, llmBaseUrl: e.target.value})}
                placeholder={currentProvider?.value === "ollama" ? "http://localhost:11434" : "Default server address"}
                spellCheck={false}
                className={inputClasses}
              />
            </div>

            <div className="mb-4">
              <label className={labelClasses}>
                AI Brain
              </label>
              <div className="flex gap-2">
                {models.length > 0 ? (
                  <select
                    value={settings.llmModel}
                    onChange={(e) => setSettings({...settings, llmModel: e.target.value})}
                    className={`flex-1 ${inputClasses}`}
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
                    className={`flex-1 ${inputClasses}`}
                  />
                )}
                <button
                  type="button"
                  onClick={refreshModels}
                  disabled={loadingModels || !settings.llmBaseUrl}
                  className="rounded-soft border border-hairline px-4 py-3 text-ink transition-colors duration-normal hover:border-hairline-strong hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loadingModels ? "..." : "Refresh"}
                </button>
              </div>
              {models.length > 0 && (
                <p className="mt-1 text-sm text-accent">
                  Found {models.length} models. Select one or clear to type your own.
                </p>
              )}
            </div>
          </div>

          {/* Search Engine Section */}
          <div className="mb-10">
            <div className="flex items-center mb-6">
              <span className="inline-block h-px w-9 bg-accent mr-3"></span>
              <span className="text-xs font-medium uppercase tracking-widest text-ink-muted">
                Web Search
              </span>
            </div>

            <div className="mb-4">
              <label className={labelClasses}>
                Search provider
              </label>
              <select
                value={settings.searchEngine}
                onChange={(e) => setSettings({...settings, searchEngine: e.target.value})}
                className={inputClasses}
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
                <p className="mb-2 text-sm text-accent">DuckDuckGo is free and requires no secret key</p>
                <button
                  type="button"
                  onClick={testSearch}
                  disabled={testingSearch}
                  className="rounded-soft border border-hairline px-4 py-2 text-sm text-ink transition-colors duration-normal hover:border-hairline-strong hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {testingSearch ? "Testing..." : "Test DuckDuckGo search"}
                </button>
              </div>
            )}

            {settings.searchEngine === "searxng" && (
              <div className="mb-4">
                <label className={labelClasses}>
                  Search server address
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={settings.searchUrl}
                    onChange={(e) => setSettings({...settings, searchUrl: e.target.value})}
                    placeholder="https://your-searxng-server.com"
                    spellCheck={false}
                    className={`flex-1 ${inputClasses}`}
                  />
                  <button
                    type="button"
                    onClick={testSearch}
                    disabled={testingSearch || !settings.searchUrl}
                    className="rounded-soft border border-hairline px-4 py-3 text-ink transition-colors duration-normal hover:border-hairline-strong hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {testingSearch ? "..." : "Test"}
                  </button>
                </div>
                <p className="mt-1 text-sm text-ink-quiet">
                  Click Test to check your SearXNG server connectivity
                </p>
              </div>
            )}

            {(settings.searchEngine === "serper" || settings.searchEngine === "bing" || settings.searchEngine === "brave") && (
              <div className="mb-4">
                <label className={labelClasses}>
                  {settings.searchEngine === "serper" ? "Serper secret key" :
                   settings.searchEngine === "bing" ? "Bing secret key" :
                   settings.searchEngine === "brave" ? "Brave secret key" : "Secret key"}
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={settings.searchApiKey}
                    onChange={(e) => setSettings({...settings, searchApiKey: e.target.value})}
                    placeholder="Enter your secret key"
                    className={`flex-1 ${inputClasses}`}
                  />
                  <button
                    type="button"
                    onClick={testSearch}
                    disabled={testingSearch || !settings.searchApiKey}
                    className="rounded-soft border border-hairline px-4 py-3 text-ink transition-colors duration-normal hover:border-hairline-strong hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {testingSearch ? "..." : "Test"}
                  </button>
                </div>
                <p className="mt-1 text-sm text-ink-quiet">
                  Click Test to check your {settings.searchEngine === "serper" ? "Serper" : settings.searchEngine === "bing" ? "Bing" : "Brave"} secret key
                </p>
              </div>
            )}
          </div>

          {/* Default Education Level Section */}
          <div className="mb-10">
            <div className="flex items-center mb-6">
              <span className="inline-block h-px w-9 bg-accent mr-3"></span>
              <span className="text-xs font-medium uppercase tracking-widest text-ink-muted">
                Defaults
              </span>
            </div>

            <div className="mb-4">
              <label className={labelClasses}>
                Default education level
              </label>
              <select
                value={settings.defaultEducationLevel}
                onChange={(e) => setSettings({...settings, defaultEducationLevel: e.target.value})}
                className={inputClasses}
              >
                <option value="Elementary School">Elementary School</option>
                <option value="Middle School">Middle School</option>
                <option value="High School">High School</option>
                <option value="College">College</option>
                <option value="Undergrad">Undergrad</option>
                <option value="Graduate">Graduate</option>
              </select>
              <p className="mt-1 text-sm text-ink-quiet">
                This will be the default level when starting a new conversation. You can still change it each time.
              </p>
            </div>
          </div>

          {/* Test Result Notification */}
          {testResult && (
            <div className={`mb-6 rounded-soft border p-4 ${
              testResult.type === 'success' ? 'border-accent bg-accent-soft text-ink' :
              testResult.type === 'warning' ? 'border-hairline-strong bg-paper-warm text-ink' :
              'border-error/30 bg-error/5 text-ink'
            }`}>
              <div className="flex items-start justify-between">
                <p className="text-sm">{testResult.message}</p>
                <button
                  onClick={() => setTestResult(null)}
                  className="ml-2 text-ink-quiet transition-colors duration-normal hover:text-ink"
                >
                  &times;
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              className="rounded-soft bg-ink px-8 py-3 font-medium text-paper transition-colors duration-normal hover:bg-accent"
            >
              {saved ? "Settings applied" : "Save and apply"}
            </button>

            <button
              onClick={handleReset}
              className="rounded-soft border border-hairline px-6 py-3 text-ink-muted transition-colors duration-normal hover:border-hairline-strong hover:text-ink"
            >
              Reset to defaults
            </button>
          </div>

          {saved && (
            <div className="mt-4 rounded-soft border border-accent bg-accent-soft p-4">
              <p className="text-sm text-ink">
                Settings saved and applied. Changes take effect straight away.
              </p>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-10 rounded-soft border border-hairline p-6">
            <div className="flex items-center mb-4">
              <span className="inline-block h-px w-9 bg-accent mr-3"></span>
              <span className="text-xs font-medium uppercase tracking-widest text-ink-muted">
                Getting started
              </span>
            </div>
            <ul className="space-y-2 text-sm text-ink-muted" style={{ lineHeight: 1.7 }}>
              <li><strong className="text-ink">Ollama (Recommended):</strong> Free local AI. Install from <a href="https://ollama.com" target="_blank" rel="noopener noreferrer" className="underline transition-colors duration-normal hover:text-accent">ollama.com</a></li>
              <li><strong className="text-ink">Find models:</strong> Click the Refresh button to see available models from your provider</li>
              <li><strong className="text-ink">Cloud providers:</strong> Require secret keys. Create accounts and add your keys above.</li>
              <li><strong className="text-ink">Web search:</strong> Optional for enriched content. Disabled by default for privacy.</li>
              <li><strong className="text-ink">SearXNG:</strong> Self-hosted search engine for privacy-conscious users.</li>
              <li><strong className="text-ink">Instant apply:</strong> Settings take effect straight away, no restart needed.</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
