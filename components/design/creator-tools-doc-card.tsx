import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function CreatorToolsDocCard({
  title,
  children,
  className,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-[24px] border border-border/60 bg-card/85 p-6", className)}>
      {title ? <h2 className="text-lg font-bold tracking-tight">{title}</h2> : null}
      <div className={cn(title ? "mt-4" : undefined)}>{children}</div>
    </section>
  );
}
