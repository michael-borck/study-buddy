"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PreparationPhase from "@/components/PreparationPhase";
import { useState, useEffect, useCallback } from "react";
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";
import { loadClientSettings } from "@/utils/settings";
import {
  prepareSession,
  buildSessionPrompt,
  type PrepStep,
} from "@/utils/session";
import Chat from "@/components/Chat";

type Phase = "landing" | "preparing" | "chat";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [topic, setTopic] = useState("");
  const [phase, setPhase] = useState<Phase>("landing");
  const [sources, setSources] = useState<{ name: string; url: string }[]>([]);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [ageGroup, setAgeGroup] = useState("Middle School");
  const [customText, setCustomText] = useState("");

  // Strategy state
  const [strategyId, setStrategyId] = useState("explain");
  const [nudgeEnabled, setNudgeEnabled] = useState(false);

  // Search toggle (landing page override)
  const [searchWeb, setSearchWeb] = useState(true);

  // Audio settings
  const [audioSettings, setAudioSettings] = useState({
    voiceGender: "female" as "male" | "female",
    autoRead: false,
    sttProvider: "web" as "web" | "whisper",
  });

  // Keep parsed sources + processed notes for rebuilding the prompt on a
  // strategy/nudge change mid-session.
  const [parsedSources, setParsedSources] = useState<
    { fullContent: string }[]
  >([]);
  const [processedNotes, setProcessedNotes] = useState("");

  // Preparation phase steps
  const [prepSteps, setPrepSteps] = useState<PrepStep[]>([]);

  // Load defaults from settings on mount
  useEffect(() => {
    if (typeof window === "undefined" || !localStorage.getItem("studybuddy-settings")) {
      return;
    }
    const settings = loadClientSettings();
    setAgeGroup(settings.defaultEducationLevel);
    // If search is disabled in settings, default the toggle off
    if (settings.searchEngine === "disabled") {
      setSearchWeb(false);
    }
    setAudioSettings({
      voiceGender: settings.voiceGender as "male" | "female",
      autoRead: settings.autoRead,
      sttProvider: settings.sttProvider as "web" | "whisper",
    });
  }, []);

  // Listen for settings changes
  useEffect(() => {
    const handleSettingsUpdate = () => {
      if (typeof window === "undefined" || !localStorage.getItem("studybuddy-settings")) {
        return;
      }
      setAgeGroup(loadClientSettings().defaultEducationLevel);
    };

    window.addEventListener("storage", handleSettingsUpdate);
    window.addEventListener("settingsChanged", handleSettingsUpdate);
    window.addEventListener("settingsLoaded", handleSettingsUpdate);

    return () => {
      window.removeEventListener("storage", handleSettingsUpdate);
      window.removeEventListener("settingsChanged", handleSettingsUpdate);
      window.removeEventListener("settingsLoaded", handleSettingsUpdate);
    };
  }, []);

  const getHeaders = useCallback(() => {
    const savedSettings = localStorage.getItem("studybuddy-settings");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (savedSettings) {
      headers["X-StudyBuddy-Settings"] = savedSettings;
    }
    return headers;
  }, []);

  const handleInitialChat = async () => {
    const currentTopic = inputValue.trim();
    if (!currentTopic) return;
    setTopic(currentTopic);
    setInputValue("");
    setChatError(null);
    setPhase("preparing");
    setLoading(true);

    try {
      const prepared = await prepareSession(
        {
          topic: currentTopic,
          notes: customText,
          ageGroup,
          strategyId,
          nudge: nudgeEnabled,
          searchWeb,
          settings: loadClientSettings(),
        },
        setPrepSteps,
      );

      setSources(prepared.sources);
      setParsedSources(prepared.content);
      setProcessedNotes(prepared.processedNotes);

      const initialMessage = [
        { role: "system", content: prepared.systemPrompt },
        { role: "user", content: currentTopic },
      ];
      setMessages(initialMessage);

      // Brief pause so the completed steps are visible before switching.
      await new Promise((r) => setTimeout(r, 400));
      setPhase("chat");

      await handleChat(initialMessage);
    } catch (e) {
      console.error("Session preparation failed:", e);
      setChatError(
        "Something went wrong while preparing your session. Please try again.",
      );
      setInputValue(currentTopic);
      setPhase("landing");
    } finally {
      setLoading(false);
    }
  };

  const handleChat = async (msgs?: { role: string; content: string }[]) => {
    setLoading(true);
    setChatError(null);

    try {
      const chatRes = await fetch("/api/getChat", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ messages: msgs }),
      });

      if (!chatRes.ok) {
        throw new Error(chatRes.statusText);
      }

      const data = chatRes.body;
      if (!data) {
        return;
      }

      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === "event") {
          const data = event.data;
          try {
            const text = JSON.parse(data).text ?? "";
            setMessages((prev) => {
              const lastMessage = prev[prev.length - 1];
              if (lastMessage.role === "assistant") {
                return [
                  ...prev.slice(0, -1),
                  { ...lastMessage, content: lastMessage.content + text },
                ];
              } else {
                return [...prev, { role: "assistant", content: text }];
              }
            });
          } catch (e) {
            console.error(e);
          }
        }
      };

      const reader = data.getReader();
      const decoder = new TextDecoder();
      const parser = createParser(onParse);
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        parser.feed(chunkValue);
      }
    } catch (e) {
      console.error("Chat request failed:", e);
      setChatError(
        "I couldn't reach your AI model. If you're using Ollama, make sure it's running on your computer.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    handleChat(messages);
  };

  // Mid-conversation strategy change — rebuild from stored content + processed
  // notes via the single prompt builder, so summarised notes are preserved.
  const handleStrategyChange = (newStrategyId: string) => {
    setStrategyId(newStrategyId);
    setMessages((prev) => {
      if (prev.length === 0) return prev;
      const newSystemContent = buildSessionPrompt({
        content: parsedSources,
        notes: processedNotes,
        ageGroup,
        strategyId: newStrategyId,
        nudge: nudgeEnabled,
      });
      return [{ ...prev[0], content: newSystemContent }, ...prev.slice(1)];
    });
  };

  const handleNudgeChange = (enabled: boolean) => {
    setNudgeEnabled(enabled);
    setMessages((prev) => {
      if (prev.length === 0) return prev;
      const newSystemContent = buildSessionPrompt({
        content: parsedSources,
        notes: processedNotes,
        ageGroup,
        strategyId,
        nudge: enabled,
      });
      return [{ ...prev[0], content: newSystemContent }, ...prev.slice(1)];
    });
  };

  return (
    <>
      <Header />

      <main className="flex grow flex-col px-4 pb-4">
        {phase === "landing" && chatError && (
          <div className="mx-auto mt-6 w-full max-w-3xl rounded-soft border border-error/30 bg-error/5 px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm text-ink" style={{ lineHeight: 1.6 }}>
                {chatError}
              </p>
              <button
                onClick={() => setChatError(null)}
                className="shrink-0 text-ink-quiet transition-colors duration-normal hover:text-ink"
                title="Dismiss"
              >
                &times;
              </button>
            </div>
          </div>
        )}

        {phase === "landing" && (
          <Hero
            promptValue={inputValue}
            setPromptValue={setInputValue}
            handleChat={handleChat}
            ageGroup={ageGroup}
            setAgeGroup={setAgeGroup}
            handleInitialChat={handleInitialChat}
            customText={customText}
            setCustomText={setCustomText}
            strategyId={strategyId}
            setStrategyId={setStrategyId}
            nudgeEnabled={nudgeEnabled}
            setNudgeEnabled={setNudgeEnabled}
            searchWeb={searchWeb}
            setSearchWeb={setSearchWeb}
          />
        )}

        {phase === "preparing" && (
          <PreparationPhase topic={topic} steps={prepSteps} />
        )}

        {phase === "chat" && (
          <div className="flex w-full grow flex-col overflow-hidden">
            <Chat
              messages={messages}
              disabled={loading}
              promptValue={inputValue}
              setPromptValue={setInputValue}
              setMessages={setMessages}
              handleChat={handleChat}
              topic={topic}
              sources={sources}
              hasCustomText={!!customText}
              strategyId={strategyId}
              onStrategyChange={handleStrategyChange}
              nudgeEnabled={nudgeEnabled}
              onNudgeChange={handleNudgeChange}
              audioSettings={audioSettings}
              chatError={chatError}
              onRetry={handleRetry}
            />
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
