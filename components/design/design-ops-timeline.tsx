"use client";

import { useState } from "react";
import { Brain, FlaskConical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  formatPlainTextSections,
  toPlainText,
} from "@/lib/design-ops-formatting";
import { cn } from "@/lib/utils";
import type { AgentMessage } from "@/lib/design-ops-types";

interface DesignOpsTimelineProps {
  messages: AgentMessage[];
}

const AGENT_CONFIG: Record<
  string,
  { icon: typeof Brain; color: string; label: string; role: string }
> = {
  design_ops_manager: {
    icon: Brain,
    color: "text-violet-400",
    label: "Atlas",
    role: "Design Lead",
  },
  research_synthesizer: {
    icon: FlaskConical,
    color: "text-emerald-400",
    label: "Beacon",
    role: "Research Analyst",
  },
};

const CONFIDENCE_STYLES: Record<string, string> = {
  high: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  low: "bg-red-500/20 text-red-400 border-red-500/30",
  "n/a": "bg-muted text-muted-foreground",
};

export function DesignOpsTimeline({ messages }: DesignOpsTimelineProps) {
  const [expandedIndices, setExpandedIndices] = useState<Set<number>>(
    () => new Set()
  );

  if (messages.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-sm">
          No crew runs yet. Define objectives and trigger a synthesis.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {messages.map((msg, i) => {
        const agent = AGENT_CONFIG[msg.from] || AGENT_CONFIG.design_ops_manager;
        const Icon = agent.icon;
        const isLast = i === messages.length - 1;
        const recipient =
          msg.to === "user" ? "You" : AGENT_CONFIG[msg.to]?.label || msg.to;
        const body = toPlainText(msg.body);
        const bodySections = formatPlainTextSections(msg.body);
        const assumptions = toPlainText(msg.assumptions);
        const nextStep = toPlainText(msg.nextStep);
        const preview = body.replace(/\s+/g, " ").trim();
        const hasDetails =
          preview.length > 120 || Boolean(assumptions || nextStep);
        const isExpanded = expandedIndices.has(i);

        return (
          <div key={i} className="relative pl-10">
            {/* Timeline connector */}
            {!isLast && (
              <div className="absolute left-3 top-8 bottom-[-0.75rem] w-px bg-border/70" />
            )}

            <div
              className={cn(
                "absolute left-0 top-1.5 flex size-6 items-center justify-center rounded-md bg-muted/60",
                agent.color
              )}
            >
              <Icon className="size-3.5" />
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 rounded-lg border border-border/60 bg-card/60 px-3 py-2 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] leading-4">
                    <span
                      className={cn(
                        "font-semibold uppercase tracking-[0.18em]",
                        agent.color
                      )}
                    >
                      {msg.fromName || agent.label}
                    </span>
                    <span className="text-muted-foreground">{agent.role}</span>
                    <span className="text-muted-foreground">→ {recipient}</span>
                  </div>

                  <div className="flex items-start gap-2">
                    <p className="min-w-0 flex-1 text-sm font-semibold tracking-tight leading-5 text-foreground">
                      {msg.subject}
                    </p>
                    <div className="flex shrink-0 items-center gap-1">
                      {msg.confidence !== "n/a" && (
                        <Badge
                          variant="outline"
                          className={cn(
                            "h-4 rounded-sm px-1 text-[9px] font-medium uppercase tracking-[0.12em]",
                            CONFIDENCE_STYLES[msg.confidence]
                          )}
                        >
                          {msg.confidence}
                        </Badge>
                      )}
                      {msg.priority === "critical" && (
                        <Badge
                          variant="destructive"
                          className="h-4 rounded-sm px-1 text-[9px] font-medium uppercase tracking-[0.12em]"
                        >
                          critical
                        </Badge>
                      )}
                    </div>
                  </div>

                  {!isExpanded && (
                    <p className="line-clamp-1 text-xs leading-5 text-muted-foreground">
                      {preview}
                    </p>
                  )}

                  {isExpanded && (
                    <div className="space-y-3 border-t border-border/50 pt-2">
                      {bodySections.map((section) => (
                        <div key={section.label} className="space-y-1">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                            {section.label}
                          </p>
                          <div className="space-y-1">
                            {section.content.map((line, index) => (
                              <p
                                key={`${section.label}-${index}`}
                                className="text-xs leading-5 text-foreground/85"
                              >
                                {line}
                              </p>
                            ))}
                          </div>
                        </div>
                      ))}

                      {assumptions && (
                        <div className="space-y-1">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                            Assumptions
                          </p>
                          <p className="text-xs leading-5 text-muted-foreground">
                            {assumptions}
                          </p>
                        </div>
                      )}
                      {nextStep && (
                        <div className="space-y-1">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                            Next
                          </p>
                          <p className="text-xs leading-5 text-foreground/85">
                            {nextStep}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {hasDetails && (
                  <button
                    type="button"
                    onClick={() => {
                      setExpandedIndices((prev) => {
                        const next = new Set(prev);
                        if (next.has(i)) {
                          next.delete(i);
                        } else {
                          next.add(i);
                        }
                        return next;
                      });
                    }}
                    className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {isExpanded ? "Less" : "More"}
                  </button>
                )}
              </div>

              {!hasDetails && preview.length === 0 && (
                <div className="text-xs text-muted-foreground">No details provided.</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
