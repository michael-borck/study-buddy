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
import Chat from "@/components/Chat";

const AUTO_SUMMARISE_THRESHOLD = 20000; // chars — roughly 5K tokens

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

  // Preparation phase steps
  const [prepSteps, setPrepSteps] = useState<PrepStep[]>([]);

  // Load default education level from settings on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("studybuddy-settings");
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        if (settings.defaultEducationLevel) {
          setAgeGroup(settings.defaultEducationLevel);
        }
      }
    } catch (error) {
      console.warn("Failed to load default education level:", error);
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

  const handleInitialChat = async () => {
    const currentTopic = inputValue;
    setTopic(currentTopic);
    setInputValue("");
    setPhase("preparing");
    setLoading(true);

    // Check if search is enabled
    let searchEnabled = true;
    try {
      const savedSettings = localStorage.getItem("studybuddy-settings");
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        if (settings.searchEngine === "disabled") {
          searchEnabled = false;
        }
      }
    } catch {}

    // Build initial steps
    const steps: PrepStep[] = [
      {
        label: searchEnabled ? "Searching for sources..." : "Web search disabled",
        status: searchEnabled ? "active" : "skipped",
      },
      { label: "Reading web pages...", status: "waiting" },
      { label: "Preparing your tutor...", status: "waiting" },
    ];
    setPrepSteps(steps);

    const headers = getHeaders();
    let fetchedSources: { name: string; url: string }[] = [];

    // Step 1: Search
    if (searchEnabled) {
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
      updateStep(1, fetchedSources.length === 0 && searchEnabled ? "skipped" : "skipped", setPrepSteps);
    }

    // Auto-summarise if content is too large
    const totalContentSize =
      parsed.reduce((sum, s) => sum + (s.fullContent?.length || 0), 0) +
      (customText?.length || 0);

    if (totalContentSize > AUTO_SUMMARISE_THRESHOLD && parsed.length > 0) {
      // Insert a summarising step before "Preparing"
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
        console.error("Summarisation failed:", e);
      }

      setPrepSteps((prev) =>
        prev.map((s, i) => (i === 2 ? { ...s, status: "done" } : s)),
      );
    }

    // Step 3: Prepare tutor
    setPrepSteps((prev) =>
      prev.map((s, i) =>
        i === prev.length - 1 ? { ...s, status: "active" } : s,
      ),
    );

    // If no sources and no custom text, teach from knowledge
    const hasContent = parsed.length > 0 || customText;

    const initialMessage = [
      {
        role: "system",
        content: hasContent
          ? getSystemPrompt(parsed, ageGroup, customText || undefined)
          : `You are a professional interactive personal tutor. The student wants to learn about a topic at a ${ageGroup} level. You don't have specific source material for this topic, so teach from your own knowledge. Be upfront that you're teaching from general knowledge and may not have the latest information. Start by greeting the learner, giving a short overview, and asking what they want to learn about (in markdown numbers). Be interactive and quiz them occasionally. Keep the first message short and concise. Please return answers in markdown.`,
      },
      { role: "user", content: currentTopic },
    ];
    setMessages(initialMessage);

    // Transition to chat
    setPrepSteps((prev) =>
      prev.map((s, i) =>
        i === prev.length - 1 ? { ...s, status: "done" } : s,
      ),
    );

    // Brief pause so the user sees all steps complete
    await new Promise((r) => setTimeout(r, 400));
    setPhase("chat");

    // Start streaming
    await handleChat(initialMessage);
    setLoading(false);
  };

  const handleChat = async (messages?: { role: string; content: string }[]) => {
    setLoading(true);

    const chatRes = await fetch("/api/getChat", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ messages }),
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
            />
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
