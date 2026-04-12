import ReactMarkdown from "react-markdown";
import FinalInputArea from "./FinalInputArea";
import { useEffect, useRef, useState } from "react";

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
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollableContainerRef = useRef<HTMLDivElement>(null);
  const [didScrollToBottom, setDidScrollToBottom] = useState(true);
  const [showSources, setShowSources] = useState(false);

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
    if (!el) {
      return;
    }

    function handleScroll() {
      if (scrollableContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } =
          scrollableContainerRef.current;
        setDidScrollToBottom(scrollTop + clientHeight >= scrollHeight);
      }
    }

    el.addEventListener("scroll", handleScroll);

    return () => {
      el.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Build attribution text
  const sourceCount = sources.length;
  let attribution = "";
  if (sourceCount > 0 && hasCustomText) {
    attribution = `Based on ${sourceCount} web source${sourceCount !== 1 ? "s" : ""} + your notes`;
  } else if (sourceCount > 0) {
    attribution = `Based on ${sourceCount} web source${sourceCount !== 1 ? "s" : ""}`;
  } else if (hasCustomText) {
    attribution = "Based on your notes";
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl grow flex-col gap-4 overflow-hidden">
      <div className="flex grow flex-col overflow-hidden lg:p-4">
        {/* Topic + attribution */}
        <div className="mb-2">
          <p className="text-xs font-medium uppercase tracking-widest text-ink-quiet">
            <span className="font-semibold text-ink">Topic:</span> {topic}
          </p>
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
        </div>

        {/* Messages */}
        <div
          ref={scrollableContainerRef}
          className="overflow-y-scroll rounded-soft border border-hairline bg-paper px-5 lg:p-7"
          style={{ flexGrow: 1 }}
        >
          {messages.length > 2 ? (
            <div className="prose-sm max-w-none lg:prose lg:max-w-none">
              {messages.slice(2).map((message, index) =>
                message.role === "assistant" ? (
                  <div className="relative w-full" key={index}>
                    <span className="absolute left-0 top-0 text-2xl">🎓</span>
                    <ReactMarkdown className="w-full pl-10">
                      {message.content}
                    </ReactMarkdown>
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
              <div ref={messagesEndRef} />
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

      <div className="lg:px-4 lg:pb-4">
        <FinalInputArea
          disabled={disabled}
          promptValue={promptValue}
          setPromptValue={setPromptValue}
          handleChat={handleChat}
          messages={messages}
          setMessages={setMessages}
        />
      </div>
    </div>
  );
}
