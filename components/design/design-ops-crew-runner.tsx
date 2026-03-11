"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Play, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type {
  Objective,
  AgentMessage,
  CrewHealthStatus,
} from "@/lib/design-ops-types";

interface DesignOpsCrewRunnerProps {
  objectives: Objective[];
  onMessages: (messages: AgentMessage[]) => void;
  onRunStatusChange: (running: boolean) => void;
  onRunComplete?: (payload: {
    prompt: string;
    objectives: Objective[];
    messages: AgentMessage[];
    provider?: string;
    model?: string;
  }) => void | Promise<void>;
}

export function DesignOpsCrewRunner({
  objectives,
  onMessages,
  onRunStatusChange,
  onRunComplete,
}: DesignOpsCrewRunnerProps) {
  const [prompt, setPrompt] = useState("");
  const [selectedObjectiveIds, setSelectedObjectiveIds] = useState<Set<string>>(
    new Set(objectives.map((o) => o.id))
  );
  const [running, setRunning] = useState(false);
  const [health, setHealth] = useState<CrewHealthStatus | null>(null);

  // Health check on mount
  useEffect(() => {
    fetch("/api/design-ops/health")
      .then((r) => r.json())
      .then(setHealth)
      .catch(() => setHealth(null));
  }, []);

  // Sync selected objectives when new ones are added
  useEffect(() => {
    setSelectedObjectiveIds(new Set(objectives.map((o) => o.id)));
  }, [objectives]);

  const toggleObjective = (id: string) => {
    setSelectedObjectiveIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

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
              subject: data.subject || "",
              priority: data.priority || "standard",
              confidence: data.confidence || "medium",
              assumptions: data.assumptions || "",
              body: data.body || "",
              nextStep: data.next_step || data.nextStep || "",
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

    const selected = objectives.filter((o) => selectedObjectiveIds.has(o.id));

    setRunning(true);
    onRunStatusChange(true);
    onMessages([]);

    try {
      const res = await fetch("/api/design-ops/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), objectives: selected }),
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
        objectives: selected,
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
    objectives,
    selectedObjectiveIds,
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
        <label className="text-sm font-medium mb-1.5 block">Focus prompt</label>
        <Textarea
          placeholder="What should Oracle focus on? (e.g., Why are users dropping off during onboarding?)"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          disabled={running}
        />
      </div>

      {/* Objective selection */}
      {objectives.length > 0 && (
        <div>
          <label className="text-sm font-medium mb-1.5 block">Evaluate against</label>
          <div className="space-y-1.5">
            {objectives.map((obj) => (
              <label
                key={obj.id}
                className="flex items-start gap-3 rounded-lg border border-transparent px-2 py-2 text-sm cursor-pointer transition-colors hover:border-border hover:bg-muted/30"
              >
                <input
                  type="checkbox"
                  checked={selectedObjectiveIds.has(obj.id)}
                  onChange={() => toggleObjective(obj.id)}
                  disabled={running}
                  className="mt-1 rounded shrink-0"
                />
                <div className="min-w-0 space-y-1">
                  <p
                    className={
                      selectedObjectiveIds.has(obj.id)
                        ? "font-medium text-foreground"
                        : "font-medium text-muted-foreground"
                    }
                  >
                    {obj.title}
                  </p>
                  <p className="text-xs leading-relaxed text-muted-foreground break-words">
                    {obj.metric}
                  </p>
                  {obj.target && (
                    <p className="text-xs leading-relaxed text-muted-foreground break-words">
                      <span className="font-medium text-foreground/80">Target:</span>{" "}
                      {obj.target}
                    </p>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Run button */}
      <Button
        onClick={handleRun}
        disabled={running || !prompt.trim()}
        className="w-full"
      >
        {running ? (
          <>
            <Loader2 className="size-4 animate-spin mr-2" />
            Crew is thinking...
          </>
        ) : (
          <>
            <Play className="size-4 mr-2" />
            Run Crew
          </>
        )}
      </Button>
    </div>
  );
}
