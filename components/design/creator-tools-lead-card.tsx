import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function CreatorToolsLeadCard({
  eyebrow,
  title,
  description,
  details,
  actions,
  className,
}: {
  eyebrow: string;
  title: string;
  description: string;
  details?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-border/60 bg-primary/95 p-5 text-primary-foreground",
        className
      )}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground/70">
        {eyebrow}
      </p>
      <h3 className="mt-3 text-xl font-black leading-8 tracking-tight md:text-2xl">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-6 text-primary-foreground/82">{description}</p>
      {details ? (
        <div className="mt-4 rounded-2xl border border-primary-foreground/15 bg-black/10 p-4">
          {details}
        </div>
      ) : null}
      {actions ? <div className="mt-4 flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
