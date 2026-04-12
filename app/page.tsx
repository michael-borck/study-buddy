"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PreparationPhase, { PrepStep } from "@/components/PreparationPhase";
import { useState, useEffect, useCallback } from "react";
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";
import { getSystemPrompt } from "@/utils/utils";
import { getStrategyById, nudgePrompt } from "@/utils/strategies";
import Chat from "@/components/Chat";

const CONTENT_BUDGET = 15000; // chars — leaves room for system prompt, strategy, and conversation

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

  // Keep parsed sources for rebuilding prompt on strategy change
  const [parsedSources, setParsedSources] = useState<
    { fullContent: string }[]
  >([]);

  // Preparation phase steps
  const [prepSteps, setPrepSteps] = useState<PrepStep[]>([]);

  // Load defaults from settings on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("studybuddy-settings");
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        if (settings.defaultEducationLevel) {
          setAgeGroup(settings.defaultEducationLevel);
        }
        // If search is disabled in settings, default the toggle off
        if (settings.searchEngine === "disabled") {
          setSearchWeb(false);
        }
        // Load audio settings
        if (settings.voiceGender) setAudioSettings((prev) => ({ ...prev, voiceGender: settings.voiceGender }));
        if (settings.autoRead !== undefined) setAudioSettings((prev) => ({ ...prev, autoRead: settings.autoRead }));
        if (settings.sttProvider) setAudioSettings((prev) => ({ ...prev, sttProvider: settings.sttProvider }));
      }
    } catch (error) {
      console.warn("Failed to load settings:", error);
    }
  }, []);

  // Listen for settings changes
  useEffect(() => {
    const handleSettingsUpdate = () => {
      try {
        const savedSettings = localStorage.getItem("studybuddy-settings");
        if (savedSettings) {
          const settings = JSON.parse(savedSettings);
          if (settings.defaultEducationLevel) {
            setAgeGroup(settings.defaultEducationLevel);
          }
        }
      } catch (error) {
        console.warn("Failed to update education level:", error);
      }
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

  const updateStep = (
    index: number,
    status: PrepStep["status"],
    setter: React.Dispatch<React.SetStateAction<PrepStep[]>>,
  ) => {
    setter((prev) => prev.map((s, i) => (i === index ? { ...s, status } : s)));
  };

  // Build system prompt with current strategy/nudge settings
  const buildSystemPrompt = useCallback(
    (parsed: { fullContent: string }[], sid: string, nudge: boolean) => {
      const strategy = getStrategyById(sid);
      return getSystemPrompt(
        parsed,
        ageGroup,
        customText || undefined,
        strategy.prompt,
        nudge ? nudgePrompt : undefined,
      );
    },
    [ageGroup, customText],
  );

  const handleInitialChat = async () => {
    const currentTopic = inputValue;
    setTopic(currentTopic);
    setInputValue("");
    setPhase("preparing");
    setLoading(true);

    // Determine if we should search — landing page toggle AND settings
    let shouldSearch = searchWeb;
    if (shouldSearch) {
      try {
        const savedSettings = localStorage.getItem("studybuddy-settings");
        if (savedSettings) {
          const settings = JSON.parse(savedSettings);
          if (settings.searchEngine === "disabled") {
            shouldSearch = false;
          }
        }
      } catch {}
    }

    // Build initial steps
    const steps: PrepStep[] = [
      {
        label: shouldSearch ? "Searching for sources..." : "Web search off",
        status: shouldSearch ? "active" : "skipped",
      },
      { label: "Reading web pages...", status: "waiting" },
      { label: "Preparing your tutor...", status: "waiting" },
    ];
    setPrepSteps(steps);

    const headers = getHeaders();
    let fetchedSources: { name: string; url: string }[] = [];

    // Step 1: Search
    if (shouldSearch) {
      try {
        const sourcesResponse = await fetch("/api/getSources", {
          method: "POST",
          headers,
          body: JSON.stringify({ question: currentTopic }),
        });
        if (sourcesResponse.ok) {
          fetchedSources = await sourcesResponse.json();
        }
      } catch (e) {
        console.error("Search failed:", e);
      }
      setSources(fetchedSources);
      updateStep(0, "done", setPrepSteps);
    }

    // Step 2: Parse sources
    let parsed: { name: string; url: string; fullContent: string }[] = [];
    if (fetchedSources.length > 0) {
      updateStep(1, "active", setPrepSteps);
      try {
        const parsedRes = await fetch("/api/getParsedSources", {
          method: "POST",
          headers,
          body: JSON.stringify({ sources: fetchedSources }),
        });
        if (parsedRes.ok) {
          parsed = await parsedRes.json();
        }
      } catch (e) {
        console.error("Parsing failed:", e);
      }
      updateStep(1, "done", setPrepSteps);
    } else {
      updateStep(1, "skipped", setPrepSteps);
    }

    // ── Fit content to context budget ──────────────────────────────
    let processedCustomText = customText || "";

    const contentSize = () =>
      parsed.reduce((sum, s) => sum + (s.fullContent?.length || 0), 0) +
      processedCustomText.length;

    // Step A: Summarise web sources if over budget
    if (contentSize() > CONTENT_BUDGET && parsed.length > 0) {
      setPrepSteps((prev) => [
        ...prev.slice(0, 2),
        { label: "Summarising sources to fit...", status: "active" },
        prev[2],
      ]);

      try {
        const summariseRes = await fetch("/api/summariseSources", {
          method: "POST",
          headers,
          body: JSON.stringify({ sources: parsed }),
        });
        if (summariseRes.ok) {
          parsed = await summariseRes.json();
        }
      } catch (e) {
        console.error("Source summarisation failed:", e);
      }

      setPrepSteps((prev) =>
        prev.map((s, i) => (i === 2 ? { ...s, status: "done" } : s)),
      );
    }

    // Step B: If notes alone are still too large, chunk and summarise them
    const notesBudget = CONTENT_BUDGET - parsed.reduce((sum, s) => sum + (s.fullContent?.length || 0), 0);
    if (processedCustomText.length > Math.max(notesBudget, 4000)) {
      setPrepSteps((prev) => {
        // Add a notes step before the final "Preparing" step
        const preparing = prev[prev.length - 1];
        return [
          ...prev.slice(0, -1),
          { label: "Your notes are long — summarising to fit...", status: "active" },
          preparing,
        ];
      });

      // Chunk notes into ~8K pieces and summarise each
      const chunkSize = 8000;
      const chunks: { name: string; url: string; fullContent: string }[] = [];
      for (let i = 0; i < processedCustomText.length; i += chunkSize) {
        chunks.push({
          name: `Notes part ${Math.floor(i / chunkSize) + 1}`,
          url: "",
          fullContent: processedCustomText.slice(i, i + chunkSize),
        });
      }

      try {
        const summariseRes = await fetch("/api/summariseSources", {
          method: "POST",
          headers,
          body: JSON.stringify({ sources: chunks }),
        });
        if (summariseRes.ok) {
          const summarised = await summariseRes.json();
          processedCustomText = summarised
            .map((s: { fullContent: string }) => s.fullContent)
            .join("\n\n");
        }
      } catch (e) {
        console.error("Notes summarisation failed:", e);
      }

      // Mark the step done
      setPrepSteps((prev) =>
        prev.map((s) =>
          s.label.includes("notes are long") ? { ...s, status: "done" } : s,
        ),
      );
    }

    // Step C: If still over budget, take fewer sources
    while (contentSize() > CONTENT_BUDGET && parsed.length > 3) {
      parsed = parsed.slice(0, parsed.length - 1);
    }

    // Store for strategy switching
    setParsedSources(parsed);

    // Step 3: Prepare tutor
    setPrepSteps((prev) =>
      prev.map((s, i) =>
        i === prev.length - 1 ? { ...s, status: "active" } : s,
      ),
    );

    const hasContent = parsed.length > 0 || processedCustomText;
    const strategy = getStrategyById(strategyId);
    const nudge = nudgeEnabled ? nudgePrompt : undefined;

    // Build system prompt — use processedCustomText (may have been summarised)
    const buildPromptWithNotes = (
      p: { fullContent: string }[],
      sid: string,
      n: boolean,
    ) => {
      const strat = getStrategyById(sid);
      return getSystemPrompt(
        p,
        ageGroup,
        processedCustomText || undefined,
        strat.prompt,
        n ? nudgePrompt : undefined,
      );
    };

    const systemContent = hasContent
      ? buildPromptWithNotes(parsed, strategyId, nudgeEnabled)
      : `You are a professional interactive personal tutor. The student wants to learn about a topic at a ${ageGroup} level. You don't have specific source material for this topic, so teach from your own knowledge. Be upfront that you're teaching from general knowledge and may not have the latest information. Start by greeting the learner, giving a short overview, and asking what they want to learn about (in markdown numbers). Be interactive. Keep the first message short and concise. Please return answers in markdown.\n\n${strategy.prompt}${nudge ? "\n\n" + nudge : ""}`;

    const initialMessage = [
      { role: "system", content: systemContent },
      { role: "user", content: currentTopic },
    ];
    setMessages(initialMessage);

    setPrepSteps((prev) =>
      prev.map((s, i) =>
        i === prev.length - 1 ? { ...s, status: "done" } : s,
      ),
    );

    await new Promise((r) => setTimeout(r, 400));
    setPhase("chat");

    await handleChat(initialMessage);
    setLoading(false);
  };

  const handleChat = async (msgs?: { role: string; content: string }[]) => {
    setLoading(true);

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
    setLoading(false);
  };

  // Mid-conversation strategy change
  const handleStrategyChange = (newStrategyId: string) => {
    setStrategyId(newStrategyId);
    setMessages((prev) => {
      if (prev.length === 0) return prev;
      const newSystemContent =
        parsedSources.length > 0 || customText
          ? buildSystemPrompt(parsedSources, newStrategyId, nudgeEnabled)
          : prev[0].content;
      return [{ ...prev[0], content: newSystemContent }, ...prev.slice(1)];
    });
  };

  const handleNudgeChange = (enabled: boolean) => {
    setNudgeEnabled(enabled);
    setMessages((prev) => {
      if (prev.length === 0) return prev;
      const newSystemContent =
        parsedSources.length > 0 || customText
          ? buildSystemPrompt(parsedSources, strategyId, enabled)
          : prev[0].content;
      return [{ ...prev[0], content: newSystemContent }, ...prev.slice(1)];
    });
  };

  return (
    <>
      <Header />

      <main className="flex grow flex-col px-4 pb-4">
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
            />
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
