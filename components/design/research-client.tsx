"use client";

import { useState } from "react";
import {
  BarChart3,
  BookOpen,
  Eye,
  Loader2,
  Play,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ResearchInsight } from "@/lib/research-types";
import { ObservationsTab } from "@/components/design/research/observations-tab";
import { OverviewTab } from "@/components/design/research/overview-tab";
import { ReplaysTab } from "@/components/design/research/replays-tab";
import { ReferenceTab } from "@/components/design/research/reference-tab";
import { SegmentsTab } from "@/components/design/research/segments-tab";

type Tab = "overview" | "observations" | "segments" | "replays" | "reference";

interface Props {
  batch: {
    batchId: string;
    createdAt: string;
    insights: ResearchInsight[];
  } | null;
}

export function ResearchClient({ batch: initialBatch }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [seeding, setSeeding] = useState(false);

  async function handleSeedDemo() {
    setSeeding(true);
    try {
      const res = await fetch("/api/design/research/seed", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Seed failed");
        return;
      }
      toast.success(
        `Seeded ${data.seeded.observations} observations, ${data.seeded.segments} segments, ${data.seeded.insights} insights`
      );
      window.location.reload();
    } catch {
      toast.error("Failed to seed demo data");
    } finally {
      setSeeding(false);
    }
  }

  const tabs: { id: Tab; label: string; icon: typeof Target }[] = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "observations", label: "Observations", icon: Eye },
    { id: "segments", label: "Segments", icon: Users },
    { id: "replays", label: "Replays", icon: Play },
    { id: "reference", label: "Reference", icon: BookOpen },
  ];

  return (
    <div className="min-w-0">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-2xl font-black tracking-tight">Research</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSeedDemo}
          disabled={seeding}
          className="gap-1.5"
        >
          {seeding ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Sparkles className="size-3.5" />
          )}
          Seed Demo Data
        </Button>
      </div>

      <div className="mb-6 flex flex-wrap gap-1 border-b border-border">
        {tabs.map((tab) => {
          const selected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "mb-px flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
                selected
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="size-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "overview" && <OverviewTab batch={initialBatch} />}
      {activeTab === "observations" && <ObservationsTab />}
      {activeTab === "segments" && <SegmentsTab />}
      {activeTab === "replays" && <ReplaysTab />}
      {activeTab === "reference" && <ReferenceTab />}
    </div>
  );
}
