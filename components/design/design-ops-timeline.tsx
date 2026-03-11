"use client";

import { Brain, FlaskConical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

        return (
          <div key={i} className="relative pl-14">
            {/* Timeline connector */}
            {!isLast && (
              <div className="absolute left-5 top-11 bottom-[-0.75rem] w-px bg-border" />
            )}

            <div
              className={cn(
                "absolute left-0 top-3 flex size-10 items-center justify-center rounded-lg bg-muted",
                agent.color
              )}
            >
              <Icon className="size-5" />
            </div>

            <Card className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <CardHeader className="px-4 py-3">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span
                    className={cn(
                      "text-[11px] font-semibold uppercase tracking-[0.16em]",
                      agent.color
                    )}
                  >
                    {msg.fromName || agent.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {agent.role}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    → {recipient}
                  </span>
                  {msg.confidence !== "n/a" && (
                    <Badge
                      variant="outline"
                      className={cn(
                        "h-5 rounded-md px-1.5 text-[10px]",
                        CONFIDENCE_STYLES[msg.confidence]
                      )}
                    >
                      {msg.confidence}
                    </Badge>
                  )}
                  {msg.priority === "critical" && (
                    <Badge
                      variant="destructive"
                      className="h-5 rounded-md px-1.5 text-[10px]"
                    >
                      critical
                    </Badge>
                  )}
                </div>

                <CardTitle className="text-base font-black tracking-tight leading-5">
                  {msg.subject}
                </CardTitle>
              </CardHeader>

              <CardContent className="px-4 pb-3 pt-0">
                <div className="space-y-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm leading-6 text-foreground/90 whitespace-pre-wrap">
                      {msg.body}
                    </div>

                    {(msg.assumptions || msg.nextStep) && (
                      <div className="flex flex-col gap-1.5 border-t border-border/60 pt-2 text-xs leading-5">
                        {msg.assumptions && (
                          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                            <span className="font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                              Assumptions
                            </span>
                            <span className="text-muted-foreground">
                              {msg.assumptions}
                            </span>
                          </div>
                        )}

                        {msg.nextStep && (
                          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                            <span className="font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                              Next
                            </span>
                            <span className="text-foreground/80">
                              {msg.nextStep}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
