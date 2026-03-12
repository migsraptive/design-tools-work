"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Loader2, Play, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DesignOpsActiveObjectiveSummary } from "@/components/design/design-ops-active-objective-summary";
import { toPlainText } from "@/lib/design-ops-formatting";
import {
  buildDeepDiveReferencePrompt,
  buildRecommendedPrompt,
  getModePromptGuidance,
} from "@/lib/design-ops-prompts";
import { toast } from "sonner";
import type {
  Objective,
  AgentMessage,
  CrewHealthStatus,
  SynthesisMode,
} from "@/lib/design-ops-types";

interface DesignOpsCrewRunnerProps {
  objective: Objective | null;
  onMessages: (messages: AgentMessage[]) => void;
  onRunStatusChange: (running: boolean) => void;
  onModeChange?: (mode: SynthesisMode) => void;
  onRunComplete?: (payload: {
    prompt: string;
    mode: SynthesisMode;
    objectives: Objective[];
    messages: AgentMessage[];
    provider?: string;
    model?: string;
  }) => void | Promise<void>;
}

const SYNTHESIS_MODES: Array<{
  value: SynthesisMode;
  label: string;
  description: string;
}> = [
  {
    value: "quick_read",
    label: "Quick read",
    description: "Fast signal: recommendation, confidence, assumptions, next step.",
  },
  {
    value: "decision_memo",
    label: "Decision memo",
    description: "Balanced depth: recommendation, rationale, alternatives, and risks.",
  },
  {
    value: "deep_dive",
    label: "Deep dive",
    description: "Full analysis: scenarios, evidence gaps, and richer tradeoffs.",
  },
];

export function DesignOpsCrewRunner({
  objective,
  onMessages,
  onRunStatusChange,
  onModeChange,
  onRunComplete,
}: DesignOpsCrewRunnerProps) {
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState<SynthesisMode>("decision_memo");
  const [running, setRunning] = useState(false);
  const [health, setHealth] = useState<CrewHealthStatus | null>(null);
  const lastSuggestedPrompt = useRef("");
  const recommendedPrompt = useMemo(() => buildRecommendedPrompt(objective), [objective]);
  const deepDiveReferencePrompt = useMemo(
    () => buildDeepDiveReferencePrompt(objective),
    [objective]
  );

  useEffect(() => {
    if (!recommendedPrompt) return;
    if (!prompt.trim() || prompt === lastSuggestedPrompt.current) {
      setPrompt(recommendedPrompt);
      lastSuggestedPrompt.current = recommendedPrompt;
    }
  }, [recommendedPrompt, prompt]);

  useEffect(() => {
    onModeChange?.(mode);
  }, [mode, onModeChange]);

  // Health check on mount
  useEffect(() => {
    fetch("/api/design-ops/health")
      .then((r) => r.json())
      .then(setHealth)
      .catch(() => setHealth(null));
  }, []);

  const consumeEventChunk = useCallback(
    (
      eventChunk: string,
      context: {
        promptText: string;
        messages: AgentMessage[];
        onEmit: (nextMessages: AgentMessage[]) => void;
        setStreamError: (message: string) => void;
      }
    ) => {
      let currentEvent = "";
      const lines = eventChunk
        .split(/\r?\n/)
        .map((line) => line.trimEnd())
        .filter(Boolean);

      for (const line of lines) {
        if (line.startsWith("event:")) {
          currentEvent = line.slice(6).trim();
          continue;
        }

        if (!line.startsWith("data:")) continue;

        try {
          const data = JSON.parse(line.slice(5).trim());
          if (currentEvent === "run_start") {
            const msg: AgentMessage = {
              from: "system",
              fromName: "SYSTEM",
              to: "user",
              subject: "Crew run started",
              priority: "standard",
              confidence: "n/a",
              assumptions: "The request was accepted and the crew orchestration has started.",
              body: `Run started for prompt: ${data.prompt || context.promptText}`,
              nextStep: "Oracle is framing the brief.",
              timestamp: data.started_at || new Date().toISOString(),
            };
            context.messages.push(msg);
            context.onEmit([...context.messages]);
            continue;
          }

          if (currentEvent === "agent_start") {
            const agentName =
              data.agent === "ORACLE"
                ? "Atlas"
                : data.agent === "MERIDIAN"
                  ? "Beacon"
                  : data.agent || "Agent";
            const msg: AgentMessage = {
              from: data.agent_id || "system",
              fromName: agentName,
              to: "user",
              subject: `${agentName} is working`,
              priority: "standard",
              confidence: "n/a",
              assumptions: "This is a progress signal, not a synthesis result.",
              body: `${agentName} is currently ${data.status || "working"} on the request.`,
              nextStep: "Wait for the next streamed update.",
              timestamp: new Date().toISOString(),
            };
            context.messages.push(msg);
            context.onEmit([...context.messages]);
            continue;
          }

          if (currentEvent === "error") {
            context.setStreamError(data.error || "Crew run failed");
            continue;
          }

          if (currentEvent === "agent_message" && data.from && data.body) {
            const msg: AgentMessage = {
              from: data.from,
              fromName: data.from_name || data.fromName || "",
              to: data.to || "",
              subject: toPlainText(data.subject || ""),
              priority: data.priority || "standard",
              confidence: data.confidence || "medium",
              assumptions: toPlainText(data.assumptions || ""),
              body: toPlainText(data.body || ""),
              nextStep: toPlainText(data.next_step || data.nextStep || ""),
              timestamp: data.timestamp || new Date().toISOString(),
            };
            context.messages.push(msg);
            context.onEmit([...context.messages]);
          }
        } catch {
          // Skip non-JSON lines
        }
      }
    },
    []
  );

  const handleRun = useCallback(async () => {
    if (!prompt.trim()) {
      toast.error("Enter a focus prompt for Oracle");
      return;
    }
    if (!objective) {
      toast.error("Create or load an objective first");
      return;
    }

    setRunning(true);
    onRunStatusChange(true);
    onMessages([]);

    try {
      const res = await fetch("/api/design-ops/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          mode,
          objectives: [objective],
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Crew run failed");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      const messages: AgentMessage[] = [];
      let buffer = "";
      let streamError: string | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split(/\r?\n\r?\n/);
        buffer = events.pop() || "";

        for (const eventChunk of events) {
          consumeEventChunk(eventChunk, {
            promptText: prompt.trim(),
            messages,
            onEmit: onMessages,
            setStreamError: (message) => {
              streamError = message;
            },
          });
        }
      }

      if (buffer.trim()) {
        consumeEventChunk(buffer, {
          promptText: prompt.trim(),
          messages,
          onEmit: onMessages,
          setStreamError: (message) => {
            streamError = message;
          },
        });
      }

      if (streamError) {
        throw new Error(streamError);
      }

      await onRunComplete?.({
        prompt: prompt.trim(),
        mode,
        objectives: [objective],
        messages: [...messages],
        provider: health?.provider,
        model: health?.configuredModel,
      });
      toast.success("Crew synthesis complete");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Crew run failed";
      toast.error(message);
    } finally {
      setRunning(false);
      onRunStatusChange(false);
    }
  }, [
    consumeEventChunk,
    prompt,
    mode,
    objective,
    onMessages,
    onRunStatusChange,
    onRunComplete,
    health?.provider,
    health?.configuredModel,
  ]);

  const providerUnavailable =
    health?.status === "ok" &&
    ["unavailable", "missing_api_key", "error"].includes(
      health?.providerStatus || ""
    );
  const providerName = health?.provider === "openai" ? "OpenAI" : "model provider";

  return (
    <div className="space-y-4">
      {/* Health warnings */}
      {providerUnavailable && (
        <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2">
          <AlertTriangle className="size-4 text-amber-400 shrink-0" />
          <p className="text-xs text-amber-400">
            {providerName} is not configured. Update your Crew env to use Design Ops.
          </p>
        </div>
      )}

      {/* Prompt input */}
      <div>
        <label className="mb-1.5 block text-sm font-medium">Synthesis depth</label>
        <div className="grid gap-2 md:grid-cols-3">
          {SYNTHESIS_MODES.map((option) => {
            const selected = mode === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setMode(option.value)}
                disabled={running}
                className={`rounded-xl border px-3 py-3 text-left transition-colors ${
                  selected
                    ? "border-primary/40 bg-primary/8"
                    : "border-border/60 bg-background hover:bg-secondary/30"
                }`}
              >
                <p className="text-sm font-semibold">{option.label}</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {option.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-1.5 block">Focus prompt</label>
        <Textarea
          placeholder="What should Oracle focus on? (e.g., Why are users dropping off during onboarding?)"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          disabled={running}
        />
        <div className="mt-3 space-y-3">
          <p className="text-sm text-muted-foreground">{getModePromptGuidance(mode)}</p>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={!recommendedPrompt || running}
              onClick={() => {
                setPrompt(recommendedPrompt);
                lastSuggestedPrompt.current = recommendedPrompt;
              }}
            >
              Use recommended prompt
            </Button>
          </div>
          {deepDiveReferencePrompt ? (
            <details className="rounded-xl border border-border/60 bg-muted/20 p-3">
              <summary className="cursor-pointer text-sm font-medium text-foreground">
                Deep dive reference prompt
              </summary>
              <div className="mt-3 space-y-3">
                <p className="text-sm leading-6 text-muted-foreground">
                  Keep the larger prompt here for slower, richer runs. Use it as reference when
                  you need more rigor, not as the default.
                </p>
                <p className="rounded-lg border border-border/60 bg-background px-3 py-3 text-sm leading-6 text-foreground/85">
                  {deepDiveReferencePrompt}
                </p>
              </div>
            </details>
          ) : null}
        </div>
      </div>

      {objective ? (
        <DesignOpsActiveObjectiveSummary objective={objective} />
      ) : null}

      {/* Run button */}
      <Button
        onClick={handleRun}
        disabled={running || !prompt.trim() || !objective}
        className="w-full"
      >
        {running ? (
          <>
            <Loader2 className="size-4 animate-spin mr-2" />
            {SYNTHESIS_MODES.find((option) => option.value === mode)?.label} in progress...
          </>
        ) : (
          <>
            <Play className="size-4 mr-2" />
            Run {SYNTHESIS_MODES.find((option) => option.value === mode)?.label}
          </>
        )}
      </Button>
    </div>
  );
}
