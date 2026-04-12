import { FC, KeyboardEvent } from "react";
import TypeAnimation from "./TypeAnimation";
import Image from "next/image";

type TInputAreaProps = {
  promptValue: string;
  setPromptValue: React.Dispatch<React.SetStateAction<string>>;
  disabled?: boolean;
  messages: { role: string; content: string }[];
  setMessages: React.Dispatch<
    React.SetStateAction<{ role: string; content: string }[]>
  >;
  handleChat: (messages?: { role: string; content: string }[]) => void;
};

const FinalInputArea: FC<TInputAreaProps> = ({
  promptValue,
  setPromptValue,
  disabled,
  messages,
  setMessages,
  handleChat,
}) => {
  function onSubmit() {
    let latestMessages = [...messages, { role: "user", content: promptValue }];
    setPromptValue("");
    setMessages(latestMessages);
    handleChat(latestMessages);
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        return;
      } else {
        e.preventDefault();
        onSubmit();
      }
    }
  };

  return (
    <form
      className="mx-auto flex w-full items-center justify-between"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="flex w-full rounded-soft border border-hairline bg-paper transition-colors duration-normal hover:border-hairline-strong">
        <textarea
          placeholder="Follow up question"
          className="block w-full resize-none rounded-l-soft border-r border-hairline bg-paper p-6 text-ink placeholder:text-ink-quiet"
          disabled={disabled}
          value={promptValue}
          onKeyDown={handleKeyDown}
          required
          onChange={(e) => setPromptValue(e.target.value)}
          rows={1}
          style={{ outline: "none" }}
        />
      </div>
      <button
        disabled={disabled}
        type="submit"
        className="relative ml-3 flex size-[72px] shrink-0 items-center justify-center rounded-soft bg-ink text-paper transition-colors duration-normal hover:bg-accent disabled:pointer-events-none disabled:opacity-75"
      >
        {disabled && (
          <div className="absolute inset-0 flex items-center justify-center">
            <TypeAnimation />
          </div>
        )}

        <Image
          unoptimized
          src={"/up-arrow.svg"}
          alt="search"
          width={24}
          height={24}
          className={disabled ? "invisible" : ""}
        />
      </button>
    </form>
  );
};

export default FinalInputArea;
