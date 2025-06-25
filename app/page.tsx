"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Sources from "@/components/Sources";
import { useState, useEffect } from "react";
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";
import { getSystemPrompt } from "@/utils/utils";
import Chat from "@/components/Chat";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [topic, setTopic] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [sources, setSources] = useState<{ name: string; url: string }[]>([]);
  const [isLoadingSources, setIsLoadingSources] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [ageGroup, setAgeGroup] = useState("Middle School");

  // Load default education level from settings on mount
  useEffect(() => {
    const loadDefaultEducationLevel = () => {
      try {
        const savedSettings = localStorage.getItem("studybuddy-settings");
        if (savedSettings) {
          const settings = JSON.parse(savedSettings);
          if (settings.defaultEducationLevel) {
            console.log("Loading default education level from settings:", settings.defaultEducationLevel);
            setAgeGroup(settings.defaultEducationLevel);
          }
        }
      } catch (error) {
        console.warn("Failed to load default education level:", error);
      }
    };

    loadDefaultEducationLevel();
  }, []);

  // Listen for settings changes (when user saves settings or settings are loaded)
  useEffect(() => {
    const handleSettingsUpdate = () => {
      try {
        const savedSettings = localStorage.getItem("studybuddy-settings");
        if (savedSettings) {
          const settings = JSON.parse(savedSettings);
          if (settings.defaultEducationLevel) {
            console.log("Settings updated, updating education level:", settings.defaultEducationLevel);
            setAgeGroup(settings.defaultEducationLevel);
          }
        }
      } catch (error) {
        console.warn("Failed to update education level from settings update:", error);
      }
    };

    // Listen for localStorage changes
    window.addEventListener('storage', handleSettingsUpdate);
    
    // Listen for settings changed event (when user saves settings)
    window.addEventListener('settingsChanged', handleSettingsUpdate);
    
    // Listen for settings loaded event (when app initializes from file)
    window.addEventListener('settingsLoaded', handleSettingsUpdate);

    return () => {
      window.removeEventListener('storage', handleSettingsUpdate);
      window.removeEventListener('settingsChanged', handleSettingsUpdate);
      window.removeEventListener('settingsLoaded', handleSettingsUpdate);
    };
  }, []);

  const handleInitialChat = async () => {
    setShowResult(true);
    setLoading(true);
    setTopic(inputValue);
    setInputValue("");

    await handleSourcesAndChat(inputValue);

    setLoading(false);
  };

  const handleChat = async (messages?: { role: string; content: string }[]) => {
    setLoading(true);
    
    // Get settings from localStorage to send with request
    const savedSettings = localStorage.getItem("studybuddy-settings");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    
    if (savedSettings) {
      headers["X-StudyBuddy-Settings"] = savedSettings;
    }
    
    const chatRes = await fetch("/api/getChat", {
      method: "POST",
      headers,
      body: JSON.stringify({ messages }),
    });

    if (!chatRes.ok) {
      throw new Error(chatRes.statusText);
    }

    // This data is a ReadableStream
    const data = chatRes.body;
    if (!data) {
      return;
    }
    let fullAnswer = "";

    const onParse = (event: ParsedEvent | ReconnectInterval) => {
      if (event.type === "event") {
        const data = event.data;
        try {
          const text = JSON.parse(data).text ?? "";
          fullAnswer += text;
          // Update messages with each chunk
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

    // https://web.dev/streams/#the-getreader-and-read-methods
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

  async function handleSourcesAndChat(question: string) {
    setIsLoadingSources(true);
    
    // Get settings from localStorage to send with request
    const savedSettings = localStorage.getItem("studybuddy-settings");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    
    if (savedSettings) {
      headers["X-StudyBuddy-Settings"] = savedSettings;
    }
    
    let sourcesResponse = await fetch("/api/getSources", {
      method: "POST",
      headers,
      body: JSON.stringify({ question }),
    });
    let sources;
    if (sourcesResponse.ok) {
      sources = await sourcesResponse.json();

      setSources(sources);
    } else {
      setSources([]);
    }
    setIsLoadingSources(false);

    const parsedSourcesRes = await fetch("/api/getParsedSources", {
      method: "POST",
      headers,
      body: JSON.stringify({ sources }),
    });
    let parsedSources;
    if (parsedSourcesRes.ok) {
      parsedSources = await parsedSourcesRes.json();
    }

    const initialMessage = [
      { role: "system", content: getSystemPrompt(parsedSources, ageGroup) },
      { role: "user", content: `${question}` },
    ];
    setMessages(initialMessage);
    await handleChat(initialMessage);
  }

  return (
    <>
      <Header />

      <main
        className={`flex grow flex-col px-4 pb-4 ${showResult ? "overflow-hidden" : ""}`}
      >
        {showResult ? (
          <div className="mt-2 flex w-full grow flex-col justify-between overflow-hidden">
            <div className="flex w-full grow flex-col space-y-2 overflow-hidden">
              <div className="mx-auto flex w-full max-w-7xl grow flex-col gap-4 overflow-hidden lg:flex-row lg:gap-10">
                <Chat
                  messages={messages}
                  disabled={loading}
                  promptValue={inputValue}
                  setPromptValue={setInputValue}
                  setMessages={setMessages}
                  handleChat={handleChat}
                  topic={topic}
                />
                <Sources sources={sources} isLoading={isLoadingSources} />
              </div>
            </div>
          </div>
        ) : (
          <Hero
            promptValue={inputValue}
            setPromptValue={setInputValue}
            handleChat={handleChat}
            ageGroup={ageGroup}
            setAgeGroup={setAgeGroup}
            handleInitialChat={handleInitialChat}
          />
        )}
      </main>
      {/* <Footer /> */}
    </>
  );
}
