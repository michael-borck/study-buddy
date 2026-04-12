import Image from "next/image";

export default function Sources({
  sources,
  isLoading,
}: {
  sources: { name: string; url: string }[];
  isLoading: boolean;
}) {
  return (
    <div className="max-lg:-order-1 lg:flex lg:w-full lg:max-w-[300px] lg:flex-col">
      <div className="flex items-start gap-4 pb-3 lg:pb-3.5">
        <h3 className="text-xs font-medium uppercase tracking-widest text-ink-quiet">
          Sources
        </h3>
      </div>
      <div className="flex w-full items-center gap-6 pb-4 max-lg:overflow-x-scroll lg:grow lg:flex-col lg:gap-4 lg:overflow-y-scroll lg:pb-0">
        {isLoading ? (
          <>
            <div className="h-20 w-[260px] max-w-sm animate-pulse rounded-soft bg-ink/10" />
            <div className="h-20 w-[260px] max-w-sm animate-pulse rounded-soft bg-ink/10" />
            <div className="hidden h-20 w-[260px] max-w-sm animate-pulse rounded-soft bg-ink/10 sm:block" />
            <div className="hidden h-20 w-[260px] max-w-sm animate-pulse rounded-soft bg-ink/10 sm:block" />
            <div className="hidden h-20 w-[260px] max-w-sm animate-pulse rounded-soft bg-ink/10 lg:block" />
            <div className="hidden h-20 w-[260px] max-w-sm animate-pulse rounded-soft bg-ink/10 lg:block" />
            <div className="hidden h-20 w-[260px] max-w-sm animate-pulse rounded-soft bg-ink/10 lg:block" />
            <div className="hidden h-20 w-[260px] max-w-sm animate-pulse rounded-soft bg-ink/10 lg:block" />
            <div className="hidden h-20 w-[260px] max-w-sm animate-pulse rounded-soft bg-ink/10 lg:block" />
          </>
        ) : sources.length > 0 ? (
          sources.map((source) => (
            <SourceCard source={source} key={source.url} />
          ))
        ) : (
          <div className="text-sm text-ink-muted">Could not fetch sources.</div>
        )}
      </div>
    </div>
  );
}

const SourceCard = ({ source }: { source: { name: string; url: string } }) => {
  return (
    <div className="flex h-[79px] w-full items-center gap-2.5 rounded-soft border border-hairline px-1.5 py-1 transition-colors duration-normal hover:border-hairline-strong">
      <div className="shrink-0">
        <Image
          unoptimized
          src={`https://www.google.com/s2/favicons?domain=${source.url}&sz=128`}
          alt={source.url}
          className="rounded-full p-1"
          width={36}
          height={36}
        />
      </div>
      <div className="flex min-w-0 max-w-[192px] flex-col justify-center gap-1">
        <h6 className="line-clamp-2 text-xs text-ink" style={{ fontWeight: 400 }}>
          {source.name}
        </h6>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={source.url}
          className="truncate text-xs text-ink-quiet"
        >
          {source.url}
        </a>
      </div>
    </div>
  );
};
