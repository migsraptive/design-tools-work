"use client";

import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  Compass,
  MessageSquareQuote,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, Pie, PieChart, Cell, XAxis } from "recharts";
import { CreatorToolsPrototypeNav } from "@/components/design/creator-tools-prototype-nav";
import { FadeIn } from "@/components/motion/fade-in";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  actionQueue,
  analyticsKpis,
  overviewFindings,
  pageviewTrend,
  threadSignals,
  trafficSources,
} from "@/lib/mock/creator-tools";

const trendConfig = {
  pageviews: { label: "Pageviews", color: "#111827" },
  engaged: { label: "Engaged readers", color: "#f59e0b" },
};

const sourceConfig = {
  direct: { label: "Direct", color: "#111827" },
  notifications: { label: "Notifications", color: "#f59e0b" },
  search: { label: "Search", color: "#10b981" },
  email: { label: "Email", color: "#3b82f6" },
};

export default function CreatorToolsDropPage() {
  return (
    <div className="w-full min-w-0 space-y-6">
      <FadeIn className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="gap-1 rounded-full px-3 py-1">
                <Sparkles className="size-3.5" />
                Project Drop
              </Badge>
              <Badge variant="outline" className="rounded-full px-3 py-1">
                Overview
              </Badge>
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight md:text-4xl">
                Community Momentum
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                The strongest shifts in participation, conversation depth, and emerging
                opportunities across the community.
              </p>
            </div>
          </div>

          <Button asChild variant="outline" className="rounded-full">
            <Link href="/drops/creator-tools/themes">
              Go to Themes
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <CreatorToolsPrototypeNav />
      </FadeIn>

      <FadeIn delay={0.05} className="w-full">
        <section className="overflow-hidden rounded-[32px] border border-border/70 bg-[linear-gradient(180deg,_rgba(255,255,255,0.94),_rgba(244,244,245,0.98))] shadow-sm dark:bg-[linear-gradient(180deg,_rgba(24,24,27,0.96),_rgba(39,39,42,0.98))]">
          <div className="border-b border-border/60 px-6 py-5 md:px-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <Compass className="size-4 text-primary" />
                  Strategic overview
                </div>
                <h2 className="text-2xl font-black tracking-tight md:text-3xl">
                  Current Signal
                </h2>
                <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                  Meal prep systems are driving the most community momentum, returning
                  readers are clustering around budget advice, and one breakout thread is
                  carrying an outsized share of engagement.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="secondary" className="rounded-full px-3 py-1">
                  7-day view
                </Badge>
                <Badge variant="outline" className="rounded-full px-3 py-1">
                  Mock data
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-4 md:p-8">
            {analyticsKpis.map((kpi) => (
              <KpiCard key={kpi.label} {...kpi} />
            ))}
          </div>

          <div className="grid gap-4 border-t border-border/60 bg-secondary/20 p-6 xl:grid-cols-[1.3fr_0.9fr] md:p-8">
            <div className="rounded-[28px] border border-border/60 bg-background/90 p-5">
              <div className="flex items-center gap-2">
                <TrendingUp className="size-4 text-primary" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Top findings
                </p>
              </div>
              <div className="mt-5 space-y-3">
                {overviewFindings.map((finding) => (
                  <Link
                    key={finding.title}
                    href={finding.href}
                    className="block rounded-2xl border border-border/60 bg-secondary/20 p-4 transition-colors hover:bg-secondary/35"
                  >
                    <p className="text-sm font-semibold">{finding.title}</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {finding.summary}
                    </p>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      {finding.cta}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-border/60 bg-primary/95 p-5 text-primary-foreground">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground/70">
                Primary Opportunity
              </p>
              <p className="mt-3 text-lg font-bold leading-7">
                Meal prep systems are the clearest path from community signal to creator
                action this week.
              </p>
              <p className="mt-3 text-sm leading-6 text-primary-foreground/75">
                The supporting thread activity and response timing both point to a
                follow-up move while the conversation is still accelerating.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild size="sm" variant="secondary">
                  <Link href="/drops/creator-tools/threads">Open threads</Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  <Link href="/drops/creator-tools/actions">See actions</Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 border-t border-border/60 p-6 xl:grid-cols-[1.1fr_0.85fr_0.85fr] md:p-8">
            <div className="rounded-[28px] border border-border/60 bg-background/90 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Momentum Trend
                  </p>
                  <h3 className="mt-1 text-lg font-bold">Community Movement</h3>
                </div>
                <Badge variant="outline" className="rounded-full px-3 py-1">
                  Readers returning
                </Badge>
              </div>

              <ChartContainer config={trendConfig} className="mt-6 h-[260px] w-full">
                <AreaChart data={pageviewTrend} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fillPageviews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-pageviews)" stopOpacity={0.24} />
                      <stop offset="95%" stopColor="var(--color-pageviews)" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="fillEngaged" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-engaged)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="var(--color-engaged)" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area type="monotone" dataKey="pageviews" stroke="var(--color-pageviews)" fill="url(#fillPageviews)" strokeWidth={2.5} />
                  <Area type="monotone" dataKey="engaged" stroke="var(--color-engaged)" fill="url(#fillEngaged)" strokeWidth={2} />
                </AreaChart>
              </ChartContainer>
            </div>

            <div className="rounded-[28px] border border-border/60 bg-background/90 p-5">
              <div className="flex items-center gap-2">
                <Users className="size-4 text-primary" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Traffic source mix
                </p>
              </div>
              <ChartContainer config={sourceConfig} className="mt-4 h-[220px] w-full">
                <PieChart>
                  <Pie data={trafficSources} dataKey="value" nameKey="name" innerRadius={48} outerRadius={78} strokeWidth={0}>
                    {trafficSources.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                </PieChart>
              </ChartContainer>
              <div className="mt-2 space-y-2">
                {trafficSources.map((source) => (
                  <div key={source.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="size-2.5 rounded-full" style={{ backgroundColor: source.fill }} />
                      <span>{source.name}</span>
                    </div>
                    <span className="font-medium">{source.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[28px] border border-border/60 bg-background/90 p-5">
                <div className="flex items-center gap-2">
                  <MessageSquareQuote className="size-4 text-primary" />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Supporting Conversations
                  </p>
                </div>
                <div className="mt-4 space-y-3">
                  {threadSignals.slice(0, 2).map((thread) => (
                    <Link
                      key={thread.title}
                      href={thread.href}
                      className="block rounded-2xl border border-border/60 bg-secondary/25 p-4 transition-colors hover:bg-secondary/40"
                    >
                      <p className="text-sm font-semibold">{thread.title}</p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{thread.body}</p>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-border/60 bg-background/90 p-5">
                <div className="flex items-center gap-2">
                  <BellRing className="size-4 text-primary" />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Priority Actions
                  </p>
                </div>
                <div className="mt-4 space-y-3">
                  {actionQueue.slice(0, 2).map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="block rounded-2xl border border-border/60 bg-secondary/25 p-4 transition-colors hover:bg-secondary/40"
                    >
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.note}</p>
                    </Link>
                  ))}
                </div>
                <Button asChild variant="ghost" className="mt-4 px-0">
                  <Link href="/drops/creator-tools/actions">
                    Open all actions
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </FadeIn>
    </div>
  );
}

function KpiCard({
  label,
  value,
  delta,
  detail,
  tone,
}: {
  label: string;
  value: string;
  delta: string;
  detail: string;
  tone: "positive" | "neutral";
}) {
  return (
    <div className="rounded-[24px] border border-border/60 bg-background/90 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-3 text-3xl font-black tracking-tight">{value}</p>
      <div
        className={`mt-2 flex items-center gap-2 text-sm ${
          tone === "positive" ? "text-emerald-600" : "text-muted-foreground"
        }`}
      >
        <TrendingUp className="size-4" />
        <span>{delta}</span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
    </div>
  );
}
