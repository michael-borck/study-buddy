import ReactMarkdown from "react-markdown";
import FinalInputArea from "./FinalInputArea";
import { useEffect, useRef, useState, useCallback } from "react";
import { strategies } from "@/utils/strategies";
import {
  speak,
  stop as stopSpeaking,
  isSpeaking,
  pickDefaultVoice,
  startWebSTT,
  stopWebSTT,
  recordAudio,
  transcribeWithWhisper,
  isWhisperLoaded,
} from "@/utils/speech";

function ChatErrorNotice({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="not-prose rounded-soft border border-error/30 bg-error/5 px-4 py-3">
      <p className="text-sm text-ink" style={{ lineHeight: 1.6 }}>
        {message}
      </p>
      <div className="mt-2 flex items-center gap-4">
        <button
          type="button"
          onClick={onRetry}
          className="rounded-soft border border-hairline px-3 py-1 text-sm font-medium text-ink transition-colors duration-normal hover:border-hairline-strong hover:text-accent"
        >
          Try again
        </button>
        <a
          href="/settings"
          className="text-sm text-ink-muted underline transition-colors duration-normal hover:text-accent"
        >
          Check settings
        </a>
      </div>
    </div>
  );
}

export default function Chat({
  messages,
  disabled,
  promptValue,
  setPromptValue,
  setMessages,
  handleChat,
  topic,
  sources,
  hasCustomText,
  strategyId,
  onStrategyChange,
  nudgeEnabled,
  onNudgeChange,
  audioSettings,
  chatError,
  onRetry,
  onStop,
  onNewTopic,
}: {
  messages: { role: string; content: string }[];
  disabled: boolean;
  promptValue: string;
  setPromptValue: React.Dispatch<React.SetStateAction<string>>;
  setMessages: React.Dispatch<
    React.SetStateAction<{ role: string; content: string }[]>
  >;
  handleChat: () => void;
  topic: string;
  sources: { name: string; url: string }[];
  hasCustomText: boolean;
  strategyId: string;
  onStrategyChange: (id: string) => void;
  nudgeEnabled: boolean;
  onNudgeChange: (enabled: boolean) => void;
  audioSettings: {
    voiceGender: "male" | "female";
    autoRead: boolean;
    sttProvider: "web" | "whisper";
  };
  chatError: string | null;
  onRetry: () => void;
  onStop: () => void;
  onNewTopic: () => void;
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollableContainerRef = useRef<HTMLDivElement>(null);
  const [didScrollToBottom, setDidScrollToBottom] = useState(true);
  const [showSources, setShowSources] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const recorderRef = useRef<{ stop: () => Promise<Blob> } | null>(null);
  const lastReadRef = useRef<number>(-1);

  // Stop any read-aloud when the chat unmounts (e.g. starting a new topic).
  useEffect(() => () => stopSpeaking(), []);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  }

  useEffect(() => {
    if (didScrollToBottom) {
      scrollToBottom();
    }
  }, [didScrollToBottom, messages]);

  useEffect(() => {
    let el = scrollableContainerRef.current;
    if (!el) return;

    function handleScroll() {
      if (scrollableContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } =
          scrollableContainerRef.current;
        setDidScrollToBottom(scrollTop + clientHeight >= scrollHeight);
      }
    }

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const readAloud = useCallback(
    (text: string, index: number) => {
      if (speakingIndex === index && isSpeaking()) {
        stopSpeaking();
        setSpeakingIndex(null);
        return;
      }
      const voice = pickDefaultVoice(audioSettings.voiceGender);
      setSpeakingIndex(index);
      speak(text, {
        voice,
        rate: 1.0,
        onEnd: () => setSpeakingIndex(null),
      });
    },
    [audioSettings.voiceGender, speakingIndex],
  );

  const copyMessage = useCallback(async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(
        () => setCopiedIndex((prev) => (prev === index ? null : prev)),
        1500,
      );
    } catch (e) {
      console.error("Copy failed:", e);
    }
  }, []);

  // Auto-read new assistant messages
  useEffect(() => {
    if (!audioSettings.autoRead || disabled) return;

    const displayMessages = messages.slice(2);
    const lastIndex = displayMessages.length - 1;
    if (lastIndex < 0) return;

    const lastMsg = displayMessages[lastIndex];
    // Only auto-read when streaming is done (disabled becomes false) and it's a new complete message
    if (lastMsg.role === "assistant" && lastIndex > lastReadRef.current) {
      lastReadRef.current = lastIndex;
      // Small delay to let the UI settle
      const timer = setTimeout(() => {
        readAloud(lastMsg.content, lastIndex);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [disabled, messages, audioSettings.autoRead, readAloud]);

  // Mic button handler
  const handleMic = useCallback(async () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      if (audioSettings.sttProvider === "whisper" && isWhisperLoaded()) {
        // Local Whisper
        if (recorderRef.current) {
          const blob = await recorderRef.current.stop();
          recorderRef.current = null;
          try {
            const text = await transcribeWithWhisper(blob);
            if (text) setPromptValue((prev) => (prev ? prev + " " + text : text));
          } catch (e) {
            console.error("Whisper transcription failed:", e);
          }
        }
      } else {
        // Web Speech API — stop triggers the final result automatically
        stopWebSTT();
      }
      return;
    }

    // Start recording
    setIsRecording(true);

    if (audioSettings.sttProvider === "whisper" && isWhisperLoaded()) {
      try {
        recorderRef.current = await recordAudio();
      } catch (e) {
        console.error("Mic access failed:", e);
        setIsRecording(false);
      }
    } else {
      // Web Speech API
      const started = startWebSTT(
        (text, isFinal) => {
          if (isFinal) {
            setPromptValue((prev) => (prev ? prev + " " + text : text));
          }
        },
        () => setIsRecording(false),
      );
      if (!started) {
        console.error("Web Speech API not available");
        setIsRecording(false);
      }
    }
  }, [isRecording, audioSettings.sttProvider, setPromptValue]);

  // Build attribution text
  const sourceCount = sources.length;
  const ungrounded = sourceCount === 0 && !hasCustomText;
  let attribution = "";
  if (sourceCount > 0 && hasCustomText) {
    attribution = `Based on ${sourceCount} web source${sourceCount !== 1 ? "s" : ""} + your notes`;
  } else if (sourceCount > 0) {
    attribution = `Based on ${sourceCount} web source${sourceCount !== 1 ? "s" : ""}`;
  } else if (hasCustomText) {
    attribution = "Based on your notes";
  }

  const displayMessages = messages.slice(2);

  return (
    <div className="mx-auto flex w-full max-w-3xl grow flex-col gap-4 overflow-hidden">
      <div className="flex grow flex-col overflow-hidden lg:p-4">
        {/* Topic + attribution */}
        <div className="mb-2">
          <div className="flex items-start justify-between gap-3">
            <p className="text-xs font-medium uppercase tracking-widest text-ink-quiet">
              <span className="font-semibold text-ink">Topic:</span> {topic}
            </p>
            <button
              type="button"
              onClick={onNewTopic}
              className="shrink-0 rounded-soft border border-hairline px-3 py-1 text-xs font-medium text-ink-muted transition-colors duration-normal hover:border-hairline-strong hover:text-accent"
            >
              New topic
            </button>
          </div>
          {attribution && (
            <div className="mt-1">
              <span className="text-xs text-ink-quiet">{attribution}</span>
              {sourceCount > 0 && (
                <>
                  <span className="text-xs text-ink-quiet"> &middot; </span>
                  <button
                    onClick={() => setShowSources(!showSources)}
                    className="text-xs text-ink-muted transition-colors duration-normal hover:text-accent"
                  >
                    {showSources ? "Hide sources" : "View sources"}
                  </button>
                </>
              )}
            </div>
          )}
          {showSources && sourceCount > 0 && (
            <ul className="mt-2 space-y-1 border-l-2 border-hairline pl-3">
              {sources.map((source) => (
                <li key={source.url} className="text-xs">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink-muted underline transition-colors duration-normal hover:text-accent"
                  >
                    {source.name}
                  </a>
                </li>
              ))}
            </ul>
          )}
          {ungrounded && (
            <p className="mt-2 rounded-soft border border-error/20 bg-error/5 px-3 py-2 text-xs text-ink-muted">
              No web sources or notes provided. The tutor is teaching from its
              own knowledge, which may not always be accurate. Check important
              facts independently.
            </p>
          )}
        </div>

        {/* Messages */}
        <div
          ref={scrollableContainerRef}
          className="overflow-y-scroll rounded-soft border border-hairline bg-paper px-5 lg:p-7"
          style={{ flexGrow: 1 }}
        >
          {displayMessages.length > 0 ? (
            <div className="prose-sm max-w-none lg:prose lg:max-w-none">
              {displayMessages.map((message, index) =>
                message.role === "assistant" ? (
                  <div className="group relative w-full" key={index}>
                    <span className="absolute left-0 top-0 text-2xl">🎓</span>
                    <ReactMarkdown className="w-full pl-10">
                      {message.content}
                    </ReactMarkdown>
                    {/* Copy + speaker buttons */}
                    <div className="absolute right-0 top-0 flex items-center gap-1 opacity-0 transition-all duration-normal focus-within:opacity-100 group-hover:opacity-100">
                      <button
                        onClick={() => copyMessage(message.content, index)}
                        className={`rounded-soft p-1 transition-colors duration-normal ${
                          copiedIndex === index
                            ? "text-accent"
                            : "text-ink-quiet hover:text-accent"
                        }`}
                        title={copiedIndex === index ? "Copied" : "Copy"}
                        aria-label={copiedIndex === index ? "Copied" : "Copy message"}
                      >
                        {copiedIndex === index ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                        )}
                      </button>
                      <button
                        onClick={() => readAloud(message.content, index)}
                        className="rounded-soft p-1 text-ink-quiet transition-colors duration-normal hover:text-accent"
                        title={speakingIndex === index ? "Stop reading" : "Read aloud"}
                        aria-label={speakingIndex === index ? "Stop reading" : "Read aloud"}
                      >
                        {speakingIndex === index ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 8.5v7a4.49 4.49 0 002.5-3.5zM14 3.23v2.06a6.51 6.51 0 010 13.42v2.06A8.51 8.51 0 0014 3.23z"/></svg>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p
                    key={index}
                    className="ml-auto w-fit rounded-soft bg-ink p-4 font-medium text-paper"
                  >
                    {message.content}
                  </p>
                ),
              )}
              {chatError && (
                <ChatErrorNotice message={chatError} onRetry={onRetry} />
              )}
              <div ref={messagesEndRef} />
            </div>
          ) : chatError ? (
            <div className="py-5">
              <ChatErrorNotice message={chatError} onRetry={onRetry} />
            </div>
          ) : (
            <div className="flex w-full flex-col gap-4 py-5">
              {Array.from(Array(6).keys()).map((i) => (
                <div
                  key={i}
                  className={`${i < 3 && "hidden sm:block"} h-10 animate-pulse rounded-soft bg-ink/10`}
                  style={{ animationDelay: `${i * 0.05}s` }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Strategy picker + nudge toggle */}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 lg:px-4">
        <div className="flex items-center gap-1.5">
          {strategies.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onStrategyChange(s.id)}
              title={s.description}
              aria-pressed={strategyId === s.id}
              className={`rounded-soft px-2 py-0.5 text-xs transition-colors duration-normal ${
                strategyId === s.id
                  ? "bg-ink text-paper"
                  : "text-ink-quiet hover:text-ink"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <label className="flex cursor-pointer items-center gap-1.5 text-xs text-ink-quiet">
          <input
            type="checkbox"
            checked={nudgeEnabled}
            onChange={(e) => onNudgeChange(e.target.checked)}
            className="h-3 w-3 cursor-pointer rounded-sm accent-accent"
          />
          Make me think
        </label>
      </div>

      {/* Input area with mic button */}
      <div className="flex items-center gap-2 lg:px-4 lg:pb-4">
        <div className="flex-1">
          <FinalInputArea
            disabled={disabled}
            promptValue={promptValue}
            setPromptValue={setPromptValue}
            handleChat={handleChat}
            messages={messages}
            setMessages={setMessages}
            onStop={onStop}
          />
        </div>
        <button
          type="button"
          onClick={handleMic}
          className={`flex h-[72px] w-[48px] shrink-0 items-center justify-center rounded-soft transition-colors duration-normal ${
            isRecording
              ? "bg-error text-paper"
              : "border border-hairline text-ink-muted hover:border-hairline-strong hover:text-accent"
          }`}
          title={isRecording ? "Stop recording" : "Voice input"}
          aria-label={isRecording ? "Stop recording" : "Voice input"}
        >
          {isRecording ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="6" width="12" height="12" rx="2"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 14a3 3 0 003-3V5a3 3 0 00-6 0v6a3 3 0 003 3zm5-3a5 5 0 01-10 0H5a7 7 0 0014 0h-2zm-5 9a1 1 0 01-1-1v-1.08A7.01 7.01 0 005 11H3a9 9 0 0018 0h-2a7.01 7.01 0 00-6 6.92V19a1 1 0 01-1 1z"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
