"use client";

import { useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  HelpCircle,
  Layers,
  Lightbulb,
  Target,
  Zap,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Pie, PieChart, XAxis, YAxis } from "recharts";
import { SynthesizeButton } from "@/components/design/synthesize-button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { ResearchInsight } from "@/lib/research-types";
import { cn } from "@/lib/utils";

const chartColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const confidenceBadge: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" }
> = {
  validated: { label: "Validated", variant: "default" },
  assumed: { label: "Assumed", variant: "secondary" },
  speculative: { label: "Speculative", variant: "outline" },
};

type OverviewSubTab = "themes" | "opportunities" | "signals" | "alignment";

export function OverviewTab({
  batch,
}: {
  batch: {
    batchId: string;
    createdAt: string;
    insights: ResearchInsight[];
  } | null;
}) {
  const [activeSubTab, setActiveSubTab] = useState<OverviewSubTab>("themes");

  const themes = batch?.insights.filter((i) => i.type === "theme") ?? [];
  const opportunities =
    batch?.insights.filter((i) => i.type === "opportunity") ?? [];
  const consensusItems =
    batch?.insights.filter((i) => i.type === "consensus") ?? [];
  const tensions = batch?.insights.filter((i) => i.type === "tension") ?? [];
  const openQuestions =
    batch?.insights.filter((i) => i.type === "open_question") ?? [];
  const signals = batch?.insights.filter((i) => i.type === "signal") ?? [];
  const oneMetric =
    batch?.insights.find((i) => i.type === "one_metric") ?? null;

  const themeChartData = themes.map((t, i) => ({
    name: t.title ?? "Untitled",
    mentions: t.mentions ?? 0,
    fill: chartColors[i % chartColors.length],
  }));

  const themeChartConfig: ChartConfig = Object.fromEntries(
    themes.map((t, i) => [
      `theme-${i}`,
      {
        label: t.title ?? "Untitled",
        color: chartColors[i % chartColors.length],
      },
    ])
  );
  themeChartConfig.mentions = { label: "Mentions" };

  const alignmentData = [
    { name: "Consensus", value: consensusItems.length, fill: "var(--chart-2)" },
    { name: "Tensions", value: tensions.length, fill: "var(--chart-5)" },
    { name: "Open Questions", value: openQuestions.length, fill: "var(--chart-1)" },
  ].filter((d) => d.value > 0);

  const alignmentConfig: ChartConfig = {
    consensus: { label: "Consensus", color: "var(--chart-2)" },
    tensions: { label: "Tensions", color: "var(--chart-5)" },
    openQuestions: { label: "Open Questions", color: "var(--chart-1)" },
  };

  const subTabs: { id: OverviewSubTab; label: string; value: number; icon: typeof Target }[] = [
    { id: "themes", label: "Themes", value: themes.length, icon: Target },
    { id: "opportunities", label: "Opportunities", value: opportunities.length, icon: Lightbulb },
    { id: "signals", label: "Signals", value: signals.length, icon: Zap },
    { id: "alignment", label: "Alignment", value: consensusItems.length + tensions.length + openQuestions.length, icon: Layers },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {batch
            ? `Last synthesized ${new Date(batch.createdAt).toLocaleDateString()}`
            : "No synthesis yet"}
        </p>
        <SynthesizeButton endpoint="/api/design/research/synthesize" />
      </div>

      {!batch ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground">
              No synthesis data yet. Click &ldquo;Synthesize&rdquo; to analyze
              your sessions with Ollama.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-8">
            {oneMetric && (
              <div className="flex items-start gap-5">
                <div className="size-12 rounded-full bg-foreground text-background flex items-center justify-center shrink-0 text-lg font-bold">
                  1
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <h3 className="text-lg font-semibold">One Metric That Matters</h3>
                  <p className="text-base font-bold tracking-tight mt-2">
                    {oneMetric.title}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {oneMetric.body}
                  </p>
                </div>
              </div>
            )}

            {signals.length > 0 && (
              <div className="flex items-start gap-5">
                <div className="size-12 rounded-full bg-foreground text-background flex items-center justify-center shrink-0 text-lg font-bold">
                  2
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <h3 className="text-lg font-semibold">Signals Worth Watching</h3>
                  <div className="mt-2 space-y-0">
                    {signals.map((signal) => (
                      <div
                        key={signal.id}
                        className="py-2 border-b border-border last:border-b-0"
                      >
                        <p className="text-sm font-medium leading-snug">
                          {signal.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                          {signal.body}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {subTabs.map((tab) => {
              const selected = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
                  className={cn(
                    "rounded-xl px-4 py-4 text-left transition-all",
                    selected
                      ? "bg-muted border border-border shadow-sm"
                      : "bg-transparent border border-transparent hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className={cn(
                          "text-3xl font-black tracking-tight tabular-nums",
                          selected ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        {tab.value}
                      </p>
                      <p
                        className={cn(
                          "text-xs mt-1",
                          selected ? "text-foreground font-medium" : "text-muted-foreground"
                        )}
                      >
                        {tab.label}
                      </p>
                    </div>
                    <tab.icon
                      className={cn(
                        "size-5",
                        selected ? "text-foreground/50" : "text-muted-foreground/40"
                      )}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="space-y-4">
            {activeSubTab === "themes" && themes.length > 0 && (
              <>
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <BarChart3 className="size-4 text-muted-foreground" />
                      </div>
                      <CardTitle className="text-xl font-semibold">
                        Theme Mentions
                      </CardTitle>
                    </div>
                    <CardDescription>Frequency across sessions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={themeChartConfig} className="h-[300px] w-full">
                      <BarChart
                        accessibilityLayer
                        data={themeChartData}
                        layout="vertical"
                        margin={{ left: 8, right: 16, top: 8, bottom: 8 }}
                      >
                        <CartesianGrid horizontal={false} />
                        <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} hide />
                        <XAxis type="number" tickLine={false} axisLine={false} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="mentions" radius={4} barSize={20}>
                          {themeChartData.map((entry, i) => (
                            <Cell key={entry.name} fill={chartColors[i % chartColors.length]} />
                          ))}
                          <LabelList
                            dataKey="name"
                            position="insideBottomLeft"
                            offset={-16}
                            fontSize={11}
                            fill="var(--color-muted-foreground, #888)"
                          />
                        </Bar>
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <Target className="size-4 text-muted-foreground" />
                      </div>
                      <CardTitle className="text-xl font-semibold">Theme Details</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {themes.map((theme, i) => {
                      const conf = (theme.metadata as Record<string, unknown>)?.confidence as string;
                      const badge = conf ? confidenceBadge[conf] : null;
                      return (
                        <div key={theme.id} className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="size-3 rounded-sm shrink-0" style={{ backgroundColor: chartColors[i % chartColors.length] }} />
                            <span className="text-sm font-medium truncate">{theme.title}</span>
                            {badge ? (
                              <Badge variant={badge.variant} className="text-[10px] shrink-0">
                                {badge.label}
                              </Badge>
                            ) : null}
                            <span className="text-muted-foreground text-xs tabular-nums shrink-0 ml-auto">
                              {theme.mentions ?? 0} mentions
                            </span>
                          </div>
                          {theme.body ? (
                            <p className="text-xs text-muted-foreground leading-relaxed pl-5">
                              {theme.body}
                            </p>
                          ) : null}
                          {i < themes.length - 1 ? <div className="h-px bg-border mt-2.5" /> : null}
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </>
            )}

            {activeSubTab === "opportunities" && opportunities.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Lightbulb className="size-4 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-xl font-semibold">Opportunities</CardTitle>
                  </div>
                  <CardDescription>How Might We questions from each theme</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {opportunities.map((opp) => {
                    const conf = (opp.metadata as Record<string, unknown>)?.confidence as string;
                    const relatedTheme = (opp.metadata as Record<string, unknown>)?.theme as string;
                    const badge = conf ? confidenceBadge[conf] : null;
                    return (
                      <div key={opp.id} className="space-y-1">
                        <div className="flex items-start gap-2">
                          <p className="text-sm font-medium leading-snug flex-1">{opp.title}</p>
                          {badge ? (
                            <Badge variant={badge.variant} className="text-[10px] shrink-0 mt-0.5">
                              {badge.label}
                            </Badge>
                          ) : null}
                        </div>
                        {relatedTheme ? (
                          <p className="text-xs text-muted-foreground">Theme: {relatedTheme}</p>
                        ) : null}
                        <div className="h-px bg-border mt-2.5" />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {activeSubTab === "signals" && signals.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Zap className="size-4 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-xl font-semibold">Signals</CardTitle>
                  </div>
                  <CardDescription>Surprising or easy-to-overlook findings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {signals.map((signal) => (
                    <div key={signal.id} className="space-y-1">
                      <p className="text-sm font-medium leading-snug">{signal.title}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{signal.body}</p>
                      <div className="h-px bg-border mt-2.5" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {activeSubTab === "alignment" && (
              <>
                {alignmentData.length > 0 ? (
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                          <Layers className="size-4 text-muted-foreground" />
                        </div>
                        <CardTitle className="text-xl font-semibold">Alignment Overview</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-8">
                        <ChartContainer config={alignmentConfig} className="h-[160px] w-[160px] shrink-0">
                          <PieChart>
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Pie
                              data={alignmentData}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              innerRadius={40}
                              outerRadius={70}
                              strokeWidth={2}
                            >
                              {alignmentData.map((entry) => (
                                <Cell key={entry.name} fill={entry.fill} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ChartContainer>
                        <div className="space-y-2">
                          {alignmentData.map((d) => (
                            <div key={d.name} className="flex items-center gap-2">
                              <div className="size-3 rounded-sm shrink-0" style={{ backgroundColor: d.fill }} />
                              <span className="text-sm">{d.name}</span>
                              <span className="text-sm font-bold tabular-nums">{d.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : null}

                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <Layers className="size-4 text-muted-foreground" />
                      </div>
                      <CardTitle className="text-xl font-semibold">Consensus vs. Tension Map</CardTitle>
                    </div>
                    <CardDescription>Where sources agree, disagree, and leave gaps</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {consensusItems.length > 0 ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <CheckCircle2 className="size-4 text-emerald-500" />
                          Consensus
                        </div>
                        {consensusItems.map((item) => (
                          <p key={item.id} className="text-sm text-muted-foreground pl-6 leading-relaxed">
                            {item.body}
                          </p>
                        ))}
                      </div>
                    ) : null}
                    {tensions.length > 0 ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <AlertTriangle className="size-4 text-amber-500" />
                          Tensions
                        </div>
                        {tensions.map((item) => (
                          <p key={item.id} className="text-sm text-muted-foreground pl-6 leading-relaxed">
                            {item.body}
                          </p>
                        ))}
                      </div>
                    ) : null}
                    {openQuestions.length > 0 ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <HelpCircle className="size-4 text-blue-500" />
                          Open Questions
                        </div>
                        {openQuestions.map((item) => (
                          <p key={item.id} className="text-sm text-muted-foreground pl-6 leading-relaxed">
                            {item.body}
                          </p>
                        ))}
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
