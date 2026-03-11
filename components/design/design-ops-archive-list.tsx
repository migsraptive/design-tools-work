"use client";

import { useMemo, useState } from "react";
import { Archive, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DesignOpsTimeline } from "@/components/design/design-ops-timeline";
import type { DesignOpsArchive } from "@/lib/design-ops-types";

interface DesignOpsArchiveListProps {
  archives: DesignOpsArchive[];
}

function formatArchiveDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function DesignOpsArchiveList({ archives }: DesignOpsArchiveListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(
    archives[0]?.id ?? null
  );

  const sortedArchives = useMemo(
    () =>
      [...archives].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [archives]
  );

  if (sortedArchives.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Archive className="size-4 text-muted-foreground" />
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Findings Archive
        </h3>
      </div>

      <div className="space-y-4">
        {sortedArchives.map((archive) => {
          const expanded = expandedId === archive.id;

          return (
            <Card key={archive.id} className="border-border/80">
              <CardHeader className="gap-3 py-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Saved synthesis
                    </p>
                    <CardTitle className="text-lg font-black tracking-tight leading-6">
                      {archive.prompt}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatArchiveDate(archive.createdAt)}</span>
                      {archive.provider && (
                        <Badge variant="outline" className="text-2xs">
                          {archive.provider}
                        </Badge>
                      )}
                      {archive.model && (
                        <Badge variant="outline" className="text-2xs">
                          {archive.model}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="shrink-0"
                    onClick={() =>
                      setExpandedId((current) =>
                        current === archive.id ? null : archive.id
                      )
                    }
                  >
                    {expanded ? (
                      <>
                        <ChevronUp className="size-4 mr-2" />
                        Hide
                      </>
                    ) : (
                      <>
                        <ChevronDown className="size-4 mr-2" />
                        View
                      </>
                    )}
                  </Button>
                </div>

                {archive.objectives.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {archive.objectives.map((objective) => (
                      <Badge key={objective.id} variant="secondary" className="text-2xs">
                        {objective.title}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardHeader>

              {expanded && (
                <CardContent className="space-y-4 pt-0">
                  <div className="rounded-xl border border-border/70 bg-muted/20 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Archived findings
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      This run has been saved locally so you can return to the
                      synthesis without rerunning Atlas and Beacon.
                    </p>
                  </div>
                  <DesignOpsTimeline messages={archive.messages} />
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
