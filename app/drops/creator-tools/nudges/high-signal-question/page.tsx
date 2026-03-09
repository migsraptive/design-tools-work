import { BellRing, MessageSquareQuote } from "lucide-react";
import { CreatorToolsShell } from "@/components/design/creator-tools-shell";

export default function CreatorToolsHighSignalPage() {
  return (
    <CreatorToolsShell
      badge="Nudge Detail"
      title="High-Signal Question"
      description="Static drill-in for the most urgent creator opportunity: a thread that crossed the engagement threshold and includes a direct creator mention."
      backHref="/drops/creator-tools/nudges"
      backLabel="Back to Nudges"
    >
      <section className="overflow-hidden rounded-[32px] border border-border/70 bg-card shadow-sm">
        <div className="grid gap-4 p-6 lg:grid-cols-[1.1fr_0.9fr] md:p-8">
          <div className="rounded-[24px] border border-border/60 bg-secondary/20 p-5">
            <div className="flex items-center gap-2">
              <MessageSquareQuote className="size-4 text-primary" />
              <p className="text-sm font-semibold">Reader prompt</p>
            </div>
            <p className="mt-4 text-base font-bold">
              “Can you share the freezer-friendly version of this meal prep system?”
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              37 replies, direct creator mention, and unusually high notification opens in
              the first hour.
            </p>
          </div>

          <div className="rounded-[24px] border border-border/60 bg-primary/95 p-5 text-primary-foreground">
            <div className="flex items-center gap-2">
              <BellRing className="size-4" />
              <p className="text-sm font-semibold">Why the system surfaced it</p>
            </div>
            <div className="mt-4 space-y-2 text-sm text-primary-foreground/80">
              <p>Crossed engagement threshold.</p>
              <p>Contains a direct creator mention.</p>
              <p>Matches this week’s top-performing theme cluster.</p>
            </div>
          </div>
        </div>
      </section>
    </CreatorToolsShell>
  );
}
