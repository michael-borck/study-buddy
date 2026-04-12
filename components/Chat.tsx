import ReactMarkdown from "react-markdown";
import FinalInputArea from "./FinalInputArea";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function Chat({
  messages,
  disabled,
  promptValue,
  setPromptValue,
  setMessages,
  handleChat,
  topic,
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
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollableContainerRef = useRef<HTMLDivElement>(null);
  const [didScrollToBottom, setDidScrollToBottom] = useState(true);

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

  return (
    <div className="flex grow flex-col gap-4 overflow-hidden">
      <div className="flex grow flex-col overflow-hidden lg:p-4">
        <p className="text-xs font-medium uppercase tracking-widest text-ink-quiet">
          <span className="text-ink font-semibold">Topic:</span>{" "}
          {topic}
        </p>
        <div
          ref={scrollableContainerRef}
          className="mt-2 overflow-y-scroll rounded-soft border border-hairline bg-paper px-5 lg:p-7"
        >
          {messages.length > 2 ? (
            <div className="prose-sm max-w-5xl lg:prose lg:max-w-full">
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
              {Array.from(Array(10).keys()).map((i) => (
                <div
                  key={i}
                  className={`${i < 5 && "hidden sm:block"} h-10 animate-pulse rounded-soft bg-ink/10`}
                  style={{ animationDelay: `${i * 0.05}s` }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="lg:p-4">
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
