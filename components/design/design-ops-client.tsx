"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { DesignOpsObjectives } from "@/components/design/design-ops-objectives";
import { DesignOpsCrewRunner } from "@/components/design/design-ops-crew-runner";
import { DesignOpsTimeline } from "@/components/design/design-ops-timeline";
import { DesignOpsArchiveList } from "@/components/design/design-ops-archive-list";
import type {
  Objective,
  AgentMessage,
  DesignOpsArchive,
} from "@/lib/design-ops-types";

export function DesignOpsClient() {
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [archives, setArchives] = useState<DesignOpsArchive[]>([]);
  const [running, setRunning] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load objectives and archives
  useEffect(() => {
    Promise.all([
      fetch("/api/design-ops/objectives").then((r) => r.json()),
      fetch("/api/design-ops/archives").then((r) => r.json()),
    ])
      .then(([objectiveData, archiveData]) => {
        setObjectives(objectiveData);
        setArchives(archiveData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddObjective = useCallback(
    async (obj: Omit<Objective, "id" | "createdAt">) => {
      try {
        const res = await fetch("/api/design-ops/objectives", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(obj),
        });
        if (!res.ok) throw new Error("Failed to add objective");
        const newObj = await res.json();
        setObjectives((prev) => [...prev, newObj]);
        toast.success("Objective added");
      } catch {
        toast.error("Failed to add objective");
      }
    },
    []
  );

  const handleDeleteObjective = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/design-ops/objectives?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setObjectives((prev) => prev.filter((o) => o.id !== id));
      toast.success("Objective removed");
    } catch {
      toast.error("Failed to remove objective");
    }
  }, []);

  const handleArchiveRun = useCallback(
    async (payload: {
      prompt: string;
      objectives: Objective[];
      messages: AgentMessage[];
      provider?: string;
      model?: string;
    }) => {
      try {
        const res = await fetch("/api/design-ops/archives", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to save synthesis");
        const archive = await res.json();
        setArchives((prev) => [archive, ...prev]);
      } catch {
        toast.error("Saved run was not archived");
      }
    },
    []
  );

  if (loading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading Design Ops...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Design Ops</h1>
        <p className="text-sm text-muted-foreground mt-1">
          AI-powered research synthesis tied to your business objectives.
        </p>
      </div>

      <section className="space-y-6">
        <DesignOpsObjectives
          objectives={objectives}
          onAdd={handleAddObjective}
          onDelete={handleDeleteObjective}
        />
      </section>

      <section className="space-y-6">
        <div className="max-w-4xl">
          <DesignOpsCrewRunner
            objectives={objectives}
            onMessages={setMessages}
            onRunStatusChange={setRunning}
            onRunComplete={handleArchiveRun}
          />
        </div>

        {(messages.length > 0 || running) && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              {running ? "Crew Activity" : "Results"}
            </h3>
            <DesignOpsTimeline messages={messages} />
          </div>
        )}
      </section>

      <section className="space-y-6">
        <DesignOpsArchiveList archives={archives} />
      </section>
    </div>
  );
}
