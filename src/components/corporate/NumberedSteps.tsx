export type Step = { title: string; text: string };

/**
 * Numbered process timeline (vertical on mobile, horizontal from lg).
 * `className` carries the <ol> grid, e.g. "mt-10 grid lg:grid-cols-4".
 */
export function NumberedSteps({ steps, className }: { steps: Step[]; className: string }) {
  return (
    <ol className={className}>
      {steps.map((step, index) => (
        <li key={step.title} className="relative min-w-0 wrap-break-word pb-7 ps-16 last:pb-0 lg:pe-7 lg:pb-0 lg:ps-0">
          <span
            aria-hidden="true"
            className={`absolute start-[21px] top-11 bottom-0 w-px bg-border-strong lg:top-[21px] lg:end-0 lg:bottom-auto lg:start-11 lg:h-px lg:w-auto ${index === steps.length - 1 ? "hidden" : ""}`}
          />
          <span
            aria-hidden="true"
            className="absolute top-0 start-0 flex size-11 items-center justify-center rounded-full border border-primary bg-surface text-sm font-semibold text-link lg:relative"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="pt-1 text-xl font-semibold leading-snug lg:mt-5 lg:pt-0">{step.title}</h3>
          <p className="mt-3 max-w-sm text-base leading-7 text-muted-foreground">{step.text}</p>
        </li>
      ))}
    </ol>
  );
}
