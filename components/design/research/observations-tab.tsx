"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Check,
  Clock,
  Copy,
  Filter,
  LayoutGrid,
  Link2,
  Loader2,
  Plus,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { AREA_TAGS, type Observation } from "@/lib/research-hub-types";

function ObservationForm({ onSubmit }: { onSubmit: () => void }) {
  const [body, setBody] = useState("");
  const [area, setArea] = useState<string>(AREA_TAGS[0]);
  const [customArea, setCustomArea] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [showSource, setShowSource] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const contributor =
    typeof window !== "undefined"
      ? localStorage.getItem("research-contributor") || ""
      : "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;

    setSubmitting(true);
    try {
      const finalArea = area === "__custom" ? customArea : area;
      const res = await fetch("/api/design/research/observations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body: body.trim(),
          area: finalArea,
          contributor: contributor || null,
          sourceUrl: sourceUrl || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to save");
        return;
      }
      setBody("");
      setSourceUrl("");
      setShowSource(false);
      onSubmit();
      toast.success("Observation logged");
    } catch {
      toast.error("Failed to save observation");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        placeholder="What did you observe? e.g. 'User hovered over share button for 12s before giving up'"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="min-h-[80px] resize-none"
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
      />

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          {AREA_TAGS.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
          <option value="__custom">+ Custom tag</option>
        </select>

        {area === "__custom" && (
          <Input
            placeholder="Custom area..."
            value={customArea}
            onChange={(e) => setCustomArea(e.target.value)}
            className="h-9 w-40"
          />
        )}

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="gap-1 text-muted-foreground"
          onClick={() => setShowSource(!showSource)}
        >
          <Link2 className="size-3.5" />
          Source
        </Button>

        <div className="flex-1" />

        <span className="text-[10px] text-muted-foreground">{"\u2318"}+Enter to submit</span>

        <Button type="submit" size="sm" disabled={submitting || !body.trim()}>
          {submitting ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Plus className="size-3.5" />
          )}
          Log
        </Button>
      </div>

      {showSource && (
        <Input
          placeholder="Mixpanel replay URL, Slack link, etc."
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
          className="h-9"
        />
      )}
    </form>
  );
}

function ShareLinkSection() {
  const [generating, setGenerating] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function generateToken() {
    setGenerating(true);
    try {
      const res = await fetch("/api/design/research/share-tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ createdBy: "admin" }),
      });
      if (!res.ok) return;
      const data = await res.json();
      setShareUrl(`${window.location.origin}/research/log?token=${data.token}`);
    } catch {
      toast.error("Failed to generate link");
    } finally {
      setGenerating(false);
    }
  }

  async function copyLink() {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-2">
      {shareUrl ? (
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <code className="flex-1 truncate rounded bg-muted px-2 py-1 text-xs">
            {shareUrl}
          </code>
          <Button variant="ghost" size="sm" onClick={copyLink}>
            {copied ? (
              <Check className="size-3.5 text-emerald-500" />
            ) : (
              <Copy className="size-3.5" />
            )}
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={generateToken}
          disabled={generating}
          className="gap-1.5"
        >
          <Link2 className="size-3.5" />
          Share Link
        </Button>
      )}
    </div>
  );
}

function ObservationCard({
  observation,
  selected,
  onToggle,
}: {
  observation: Observation;
  selected: boolean;
  onToggle: () => void;
}) {
  const timeAgo = getTimeAgo(new Date(observation.createdAt));

  return (
    <Card
      className={cn(
        "cursor-pointer transition-colors",
        selected ? "border-primary bg-primary/5" : "hover:bg-muted/50"
      )}
      onClick={onToggle}
    >
      <CardContent className="flex items-start gap-3 p-3">
        <div
          className={cn(
            "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border-2 transition-colors",
            selected ? "border-primary bg-primary" : "border-muted-foreground/30"
          )}
        >
          {selected && <Check className="size-2.5 text-primary-foreground" />}
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-sm leading-relaxed">{observation.body}</p>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="text-[10px]">
              {observation.area}
            </Badge>
            {observation.contributor && (
              <span className="text-[10px] text-muted-foreground">
                {observation.contributor}
              </span>
            )}
            <span className="text-[10px] text-muted-foreground">{timeAgo}</span>
            {observation.sourceUrl && (
              <a
                href={observation.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-primary hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                Source
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function ObservationsTab() {
  const [observations, setObservations] = useState<Observation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterArea, setFilterArea] = useState<string | null>(null);
  const [groupByArea, setGroupByArea] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [synthesizing, setSynthesizing] = useState(false);

  const fetchObservations = useCallback(async () => {
    const url = filterArea
      ? `/api/design/research/observations?area=${encodeURIComponent(filterArea)}`
      : "/api/design/research/observations";
    const res = await fetch(url);
    if (res.ok) {
      setObservations(await res.json());
    }
    setLoading(false);
  }, [filterArea]);

  useEffect(() => {
    void fetchObservations();
  }, [fetchObservations]);

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAllVisible() {
    setSelected(new Set(observations.map((o) => o.id)));
  }

  async function handleSynthesize() {
    if (selected.size === 0) return;
    setSynthesizing(true);
    try {
      const res = await fetch("/api/design/research/observe-synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ observationIds: [...selected] }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Synthesis failed");
        return;
      }
      toast.success(
        `Synthesized ${data.insightCount} insights${data.newSegments > 0 ? ` + ${data.newSegments} new segments` : ""}`
      );
      setSelected(new Set());
    } catch {
      toast.error("Synthesis failed");
    } finally {
      setSynthesizing(false);
    }
  }

  const areaCounts: Record<string, number> = {};
  for (const o of observations) {
    areaCounts[o.area] = (areaCounts[o.area] || 0) + 1;
  }

  const grouped = groupByArea
    ? Object.entries(areaCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([area]) => ({
          area,
          items: observations.filter((o) => o.area === area),
        }))
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Log what you noticed in session replays. Select observations to
          synthesize into segment insights.
        </p>
        <ShareLinkSection />
      </div>

      <Card>
        <CardContent className="p-4">
          <ObservationForm onSubmit={fetchObservations} />
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5">
          <Filter className="size-3.5 text-muted-foreground" />
          <select
            value={filterArea || ""}
            onChange={(e) => setFilterArea(e.target.value || null)}
            className="h-8 rounded-md border border-input bg-background px-2 text-xs"
          >
            <option value="">All areas</option>
            {Object.entries(areaCounts).map(([area, count]) => (
              <option key={area} value={area}>
                {area} ({count})
              </option>
            ))}
          </select>
        </div>

        <Button
          variant={groupByArea ? "secondary" : "ghost"}
          size="sm"
          className="h-8 gap-1"
          onClick={() => setGroupByArea(!groupByArea)}
        >
          {groupByArea ? (
            <Clock className="size-3.5" />
          ) : (
            <LayoutGrid className="size-3.5" />
          )}
          {groupByArea ? "Timeline" : "By Area"}
        </Button>

        <div className="flex-1" />

        {observations.length > 0 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs"
              onClick={selectAllVisible}
            >
              Select all ({observations.length})
            </Button>

            {selected.size > 0 && (
              <Button
                size="sm"
                className="h-8 gap-1.5"
                onClick={handleSynthesize}
                disabled={synthesizing}
              >
                {synthesizing ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Sparkles className="size-3.5" />
                )}
                Synthesize ({selected.size})
              </Button>
            )}
          </>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : observations.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <p className="text-sm">No observations yet.</p>
            <p className="mt-1 text-xs">
              Log your first observation above, or share the link with your team.
            </p>
          </CardContent>
        </Card>
      ) : grouped ? (
        grouped.map(({ area, items }) => (
          <div key={area} className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {area}
              </Badge>
              <span className="text-[10px] text-muted-foreground">
                {items.length} observation{items.length !== 1 ? "s" : ""}
              </span>
            </div>
            {items.map((obs) => (
              <ObservationCard
                key={obs.id}
                observation={obs}
                selected={selected.has(obs.id)}
                onToggle={() => toggleSelect(obs.id)}
              />
            ))}
          </div>
        ))
      ) : (
        <div className="space-y-2">
          {observations.map((obs) => (
            <ObservationCard
              key={obs.id}
              observation={obs}
              selected={selected.has(obs.id)}
              onToggle={() => toggleSelect(obs.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
