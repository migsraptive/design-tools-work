"use client";

import { SynthesizeButton } from "@/components/design/synthesize-button";
import { SessionInsights } from "@/components/design/session-insights";
import type { ExplorationSession } from "@/lib/design-types";
import type { ResearchInsight } from "@/lib/research-types";

export function SessionResearchTabContent({
  session,
  isCreator,
  insights,
  onReloadInsights,
}: {
  session: ExplorationSession;
  isCreator: boolean;
  insights: ResearchInsight[];
  onReloadInsights: () => Promise<void>;
}) {
  if (session.phase !== "revealed") {
    return (
      <div className="rounded-lg border border-dashed bg-muted/20 px-4 py-6 text-sm text-muted-foreground">
        Research becomes available after voting is complete and the session reaches the results phase.
      </div>
    );
  }

  if (insights.length > 0) {
    return <SessionInsights insights={insights} />;
  }

  if (isCreator) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-dashed bg-muted/30 px-4 py-4">
        <p className="text-sm text-muted-foreground">
          Synthesize voter feedback into actionable insights
        </p>
        <SynthesizeButton
          endpoint={`/api/design/sessions/${session.id}/synthesize`}
          variant="outline"
          icon="flask"
          onComplete={onReloadInsights}
        />
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-dashed bg-muted/20 px-4 py-6 text-sm text-muted-foreground">
      Research synthesis will appear here once the session owner generates insights.
    </div>
  );
}
