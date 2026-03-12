"use client";

import { useMemo, useState } from "react";
import { Brain, ChevronDown, FlaskConical } from "lucide-react";
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
  system: {
    icon: Brain,
    color: "text-violet-400",
    label: "System",
    role: "System",
  },
};

const CONFIDENCE_STYLES: Record<string, string> = {
  high: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  low: "bg-red-500/20 text-red-400 border-red-500/30",
  "n/a": "bg-muted text-muted-foreground",
};

function isProcessMessage(msg: AgentMessage): boolean {
  const subject = msg.subject.toLowerCase();
  const body = msg.body.toLowerCase();

  return (
    msg.confidence === "n/a" ||
    msg.from === "system" ||
    subject === "crew run started" ||
    subject.endsWith("is working") ||
    subject.includes("synthesis complete") ||
    body.includes("directing beacon") ||
    body.includes("directing meridian") ||
    body.includes("currently thinking on the request") ||
    body.includes("currently working on the request")
  );
}

function renderPreview(msg: AgentMessage): string {
  return toPlainText(msg.body).replace(/\s+/g, " ").trim();
}

function renderMeta(msg: AgentMessage) {
  const agent =
    AGENT_CONFIG[msg.from] || AGENT_CONFIG.design_ops_manager;
  const recipient =
    msg.to === "user" ? "You" : AGENT_CONFIG[msg.to]?.label || msg.to;

  return { agent, recipient };
}

function ProcessStep({ msg }: { msg: AgentMessage }) {
  const { agent, recipient } = renderMeta(msg);
  const Icon = agent.icon;
  const preview = renderPreview(msg);

  return (
    <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-card/50 px-3 py-3">
      <div
        className={cn(
          "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-muted/60",
          agent.color
        )}
      >
        <Icon className="size-3.5" />
      </div>
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
        <p className="text-sm font-semibold tracking-tight text-foreground">
          {msg.subject}
        </p>
        {preview ? (
          <p className="text-sm leading-6 text-muted-foreground">{preview}</p>
        ) : null}
      </div>
    </div>
  );
}

function SynthesisCard({ msg }: { msg: AgentMessage }) {
  const [expanded, setExpanded] = useState(true);
  const { agent, recipient } = renderMeta(msg);
  const Icon = agent.icon;
  const bodySections = formatPlainTextSections(msg.body);
  const assumptions = toPlainText(msg.assumptions);
  const nextStep = toPlainText(msg.nextStep);
  const preview = renderPreview(msg);
  const hasDetails =
    bodySections.length > 0 || Boolean(assumptions || nextStep || preview);

  return (
    <div className="rounded-xl border border-border/60 bg-card px-4 py-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-muted/60",
            agent.color
          )}
        >
          <Icon className="size-4" />
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
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
              <p className="text-lg font-semibold tracking-tight text-foreground">
                {msg.subject}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {msg.confidence !== "n/a" ? (
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-sm px-1.5 py-0 text-[10px] font-medium uppercase tracking-[0.12em]",
                    CONFIDENCE_STYLES[msg.confidence]
                  )}
                >
                  {msg.confidence}
                </Badge>
              ) : null}
              {hasDetails ? (
                <button
                  type="button"
                  onClick={() => setExpanded((prev) => !prev)}
                  className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
                >
                  {expanded ? "Less" : "More"}
                  <ChevronDown
                    className={cn("size-3 transition-transform", expanded && "rotate-180")}
                  />
                </button>
              ) : null}
            </div>
          </div>

          {!expanded && preview ? (
            <p className="text-sm leading-6 text-muted-foreground">{preview}</p>
          ) : null}

          {expanded ? (
            <div className="space-y-3 border-t border-border/50 pt-3">
              {bodySections.map((section) => (
                <div key={section.label} className="space-y-1">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {section.label}
                  </p>
                  <div className="space-y-1">
                    {section.content.map((line, index) => (
                      <p
                        key={`${section.label}-${index}`}
                        className="text-sm leading-6 text-foreground/85"
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}

              {assumptions ? (
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Assumptions
                  </p>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {assumptions}
                  </p>
                </div>
              ) : null}

              {nextStep ? (
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Next step
                  </p>
                  <p className="text-sm leading-6 text-foreground/85">{nextStep}</p>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function DesignOpsTimeline({ messages }: DesignOpsTimelineProps) {
  const [showProcess, setShowProcess] = useState(false);

  const { synthesisMessages, processMessages } = useMemo(() => {
    const synthesis = messages.filter((msg) => !isProcessMessage(msg));
    const process = messages.filter((msg) => isProcessMessage(msg));
    return {
      synthesisMessages: synthesis,
      processMessages: process,
    };
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-muted-foreground">
          No crew runs yet. Define objectives and trigger a synthesis.
        </p>
      </div>
    );
  }

  const latestProcess = processMessages.at(-1);

  return (
    <div className="space-y-4">
      {synthesisMessages.length === 0 && latestProcess ? (
        <div className="rounded-xl border border-border/60 bg-card px-4 py-4 shadow-sm">
          <div className="space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-400">
              Live run
            </p>
            <p className="text-lg font-semibold tracking-tight text-foreground">
              Analyzing objective
            </p>
            <p className="text-sm leading-6 text-muted-foreground">
              Atlas is framing the problem and Beacon is synthesizing the strongest
              available signals.
            </p>
          </div>
        </div>
      ) : null}

      {synthesisMessages.map((msg, index) => (
        <SynthesisCard key={`${msg.timestamp}-${index}`} msg={msg} />
      ))}

      {processMessages.length > 0 ? (
        <div className="rounded-xl border border-border/60 bg-card px-4 py-4">
          <button
            type="button"
            onClick={() => setShowProcess((prev) => !prev)}
            className="flex w-full items-center justify-between gap-3 text-left"
          >
            <div className="space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Process details
              </p>
              <p className="text-sm leading-6 text-muted-foreground">
                Internal agent choreography for transparency and debugging.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {showProcess ? "Hide" : "Show"}
              <ChevronDown
                className={cn("size-3 transition-transform", showProcess && "rotate-180")}
              />
            </span>
          </button>

          {showProcess ? (
            <div className="mt-4 space-y-3 border-t border-border/50 pt-4">
              {processMessages.map((msg, index) => (
                <ProcessStep key={`${msg.timestamp}-${index}`} msg={msg} />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
