"use client";

import { Target } from "lucide-react";
import type { Objective } from "@/lib/design-ops-types";
import {
  designOpsSegments,
  lifecycleCohortOptions,
} from "@/lib/mock/design-ops-growth-context";

interface DesignOpsActiveObjectiveSummaryProps {
  objective: Objective;
}

export function DesignOpsActiveObjectiveSummary({
  objective,
}: DesignOpsActiveObjectiveSummaryProps) {
  const segmentLabel = objective.segmentIds
    .map(
      (segmentId) =>
        designOpsSegments.find((segment) => segment.id === segmentId)?.name ?? segmentId
    )
    .join(", ");
  const cohortLabel = objective.lifecycleCohorts
    .map(
      (cohortId) =>
        lifecycleCohortOptions.find((cohort) => cohort.value === cohortId)?.label ?? cohortId
    )
    .join(", ");

  return (
    <div className="rounded-xl border border-border/70 bg-muted/20 p-4">
      <div className="flex items-center gap-2">
        <Target className="size-4 text-muted-foreground" />
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Active objective
        </p>
      </div>
      <div className="mt-3 space-y-2">
        <p className="text-sm font-semibold text-foreground">{objective.title}</p>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-foreground">
            {objective.metric}
          </span>
          <span className="rounded-full border border-border/70 px-2 py-0.5 text-xs text-muted-foreground">
            {objective.stage.replaceAll("_", " ")}
          </span>
        </div>
        {objective.target ? (
          <p className="text-sm leading-6 text-muted-foreground">{objective.target}</p>
        ) : null}
        {segmentLabel || cohortLabel ? (
          <p className="text-xs leading-6 text-muted-foreground">
            {[segmentLabel, cohortLabel].filter(Boolean).join(" · ")}
          </p>
        ) : null}
      </div>
    </div>
  );
}
