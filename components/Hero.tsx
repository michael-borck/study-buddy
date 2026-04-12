import Image from "next/image";
import { FC } from "react";
import InitialInputArea from "./InitialInputArea";
import { suggestions } from "@/utils/utils";

type THeroProps = {
  promptValue: string;
  setPromptValue: React.Dispatch<React.SetStateAction<string>>;
  handleChat: (messages?: { role: string; content: string }[]) => void;
  ageGroup: string;
  setAgeGroup: React.Dispatch<React.SetStateAction<string>>;
  handleInitialChat: () => void;
};

const Hero: FC<THeroProps> = ({
  promptValue,
  setPromptValue,
  handleChat,
  ageGroup,
  setAgeGroup,
  handleInitialChat,
}) => {
  const handleClickSuggestion = (value: string) => {
    setPromptValue(value);
  };

  return (
    <>
      <div className="mx-auto mt-10 flex max-w-3xl flex-col items-center justify-center sm:mt-36">
        <h2 className="mt-2 text-center text-4xl font-semibold tracking-tight text-ink sm:text-6xl" style={{ lineHeight: 1.1 }}>
          Your Personal{" "}
          <span className="text-accent">Tutor</span>
        </h2>
        <p className="mt-4 max-w-xl text-balance text-center text-sm text-ink-muted sm:text-base" style={{ lineHeight: 1.7 }}>
          Enter a topic you want to learn about along with the education level
          you want to be taught at and generate a personalised tutor tailored to
          you.
        </p>

        <div className="mt-6 w-full pb-6">
          <InitialInputArea
            promptValue={promptValue}
            handleInitialChat={handleInitialChat}
            setPromptValue={setPromptValue}
            handleChat={handleChat}
            ageGroup={ageGroup}
            setAgeGroup={setAgeGroup}
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5 pb-8 lg:flex-nowrap lg:justify-normal">
          {suggestions.map((item) => (
            <div
              className="flex h-[35px] cursor-pointer items-center justify-center gap-[5px] rounded-soft border border-hairline px-2.5 py-2 transition-colors duration-normal hover:border-hairline-strong"
              onClick={() => handleClickSuggestion(item?.name)}
              key={item.id}
            >
              <Image
                src={item.icon}
                alt={item.name}
                width={18}
                height={16}
                className="w-[18px]"
              />
              <span className="text-sm text-ink-muted" style={{ fontWeight: 400 }}>
                {item.name}
              </span>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-ink-quiet" style={{ fontWeight: 400 }}>
          Fully open source!{" "}
          <a
            href="https://github.com/michael-borck/study-buddy"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-ink-muted underline transition-colors duration-normal hover:text-accent"
          >
            Star it on GitHub.
          </a>
        </p>
      </div>
    </>
  );
};

export default Hero;
