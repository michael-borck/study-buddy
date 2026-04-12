import { FC } from "react";

export type PrepStep = {
  label: string;
  status: "waiting" | "active" | "done" | "skipped";
};

type PreparationPhaseProps = {
  topic: string;
  steps: PrepStep[];
};

const PreparationPhase: FC<PreparationPhaseProps> = ({ topic, steps }) => {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center justify-center pt-24">
      <h2
        className="mb-2 text-center text-2xl font-semibold text-ink"
        style={{ lineHeight: 1.3 }}
      >
        Preparing your tutor
      </h2>
      <p className="mb-10 text-center text-sm text-ink-muted">
        Topic: <span className="font-medium text-ink">{topic}</span>
      </p>

      <div className="w-full max-w-sm space-y-4">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-3">
            <StepIndicator status={step.status} />
            <span
              className={`text-sm ${
                step.status === "done"
                  ? "text-ink-muted"
                  : step.status === "active"
                    ? "font-medium text-ink"
                    : step.status === "skipped"
                      ? "text-ink-quiet line-through"
                      : "text-ink-quiet"
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const StepIndicator: FC<{ status: PrepStep["status"] }> = ({ status }) => {
  if (status === "done") {
    return (
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-xs text-accent">
        &#10003;
      </span>
    );
  }
  if (status === "active") {
    return (
      <span className="flex h-5 w-5 shrink-0 items-center justify-center">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-accent" />
      </span>
    );
  }
  if (status === "skipped") {
    return (
      <span className="flex h-5 w-5 shrink-0 items-center justify-center text-xs text-ink-quiet">
        &mdash;
      </span>
    );
  }
  // waiting
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center">
      <span className="h-2 w-2 rounded-full bg-ink/10" />
    </span>
  );
};

export default PreparationPhase;
