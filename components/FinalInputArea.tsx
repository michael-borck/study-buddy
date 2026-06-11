import { FC, KeyboardEvent } from "react";
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
  onStop: () => void;
};

const FinalInputArea: FC<TInputAreaProps> = ({
  promptValue,
  setPromptValue,
  disabled,
  messages,
  setMessages,
  handleChat,
  onStop,
}) => {
  function onSubmit() {
    const question = promptValue.trim();
    if (!question || disabled) return;
    let latestMessages = [...messages, { role: "user", content: question }];
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
      {disabled ? (
        <button
          type="button"
          onClick={onStop}
          title="Stop generating"
          className="relative ml-3 flex size-[72px] shrink-0 items-center justify-center rounded-soft bg-ink text-paper transition-colors duration-normal hover:bg-error"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="6" width="12" height="12" rx="2" />
          </svg>
        </button>
      ) : (
        <button
          type="submit"
          title="Send"
          className="relative ml-3 flex size-[72px] shrink-0 items-center justify-center rounded-soft bg-ink text-paper transition-colors duration-normal hover:bg-accent"
        >
          <Image
            unoptimized
            src={"/up-arrow.svg"}
            alt="Send"
            width={24}
            height={24}
          />
        </button>
      )}
    </form>
  );
};

export default FinalInputArea;
