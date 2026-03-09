import { RotateCcw, Users } from "lucide-react";
import { CreatorToolsShell } from "@/components/design/creator-tools-shell";

export default function CreatorToolsLapsedReaderPage() {
  return (
    <CreatorToolsShell
      badge="Nudge Detail"
      title="Lapsed Reader Opportunity"
      description="Static drill-in for the retention-focused nudge showing when a creator reply may bring previously active readers back."
      backHref="/drops/creator-tools/nudges"
      backLabel="Back to Nudges"
    >
      <section className="overflow-hidden rounded-[32px] border border-border/70 bg-card shadow-sm">
        <div className="grid gap-4 p-6 md:grid-cols-2 md:p-8">
          <div className="rounded-[24px] border border-border/60 bg-secondary/20 p-5">
            <div className="flex items-center gap-2">
              <Users className="size-4 text-primary" />
              <p className="text-sm font-semibold">Re-engagement signal</p>
            </div>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Two readers who were active two weeks ago both reappeared in the recent
              budget thread after your last reply.
            </p>
          </div>

          <div className="rounded-[24px] border border-border/60 bg-primary/95 p-5 text-primary-foreground">
            <div className="flex items-center gap-2">
              <RotateCcw className="size-4" />
              <p className="text-sm font-semibold">Suggested action</p>
            </div>
            <p className="mt-4 text-sm leading-6 text-primary-foreground/80">
              Reply again in the same thread while momentum is still active. The goal is
              not to identify who returned, but to signal that creator presence has
              outsized retention value here.
            </p>
          </div>
        </div>
      </section>
    </CreatorToolsShell>
  );
}
