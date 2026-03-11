"use client";

import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { SectionFeedback } from "@/components/design/section-feedback";
import { CreatorToolsConfidenceBadge } from "@/components/design/creator-tools-confidence-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  creatorToolsConfidenceSummary,
  overviewFindings,
} from "@/lib/mock/creator-tools";
import { creatorToolsFeedbackId } from "@/lib/mock/creator-tools-feedback";
import { dataConfidenceCopy } from "@/lib/data-confidence";

export function CreatorToolsOverviewSignal() {
  return (
    <>
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
              Weekly view
            </Badge>
            <Badge variant="outline" className="rounded-full px-3 py-1">
              Mock data
            </Badge>
            <Badge
              variant="outline"
              className={`rounded-full px-3 py-1 ${
                dataConfidenceCopy[creatorToolsConfidenceSummary.anchor.state].className
              }`}
            >
              {creatorToolsConfidenceSummary.anchor.label}
            </Badge>
          </div>
        </div>
      </div>

      <div className="border-b border-border/60 bg-secondary/25 px-6 py-4 md:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Data confidence
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Use this page to align on direction. The detailed evidence and metrics
              live inside the modules, not on the landing page.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {creatorToolsConfidenceSummary.statuses.map((item) => (
              <Badge
                key={item.label}
                variant="outline"
                className={`rounded-full px-3 py-1 ${
                  dataConfidenceCopy[item.state].className
                }`}
              >
                {item.label}
              </Badge>
            ))}
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Source: {creatorToolsConfidenceSummary.anchor.source} · Owner:{" "}
          {creatorToolsConfidenceSummary.anchor.owner} · Verified{" "}
          {creatorToolsConfidenceSummary.anchor.verifiedAt}
        </p>
      </div>

      <div className="grid gap-4 border-t border-border/60 bg-secondary/20 p-6 xl:grid-cols-[0.95fr_1.05fr] md:p-8">
        <div className="self-start rounded-[28px] border border-border/60 bg-primary/95 p-5 text-primary-foreground">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground/70">
            Current recommendation
          </p>
          <p className="mt-3 text-lg font-bold leading-7">
            Meal prep systems are the clearest path from community signal to creator
            action this week.
          </p>
          <p className="mt-3 text-sm leading-6 text-primary-foreground/75">
            The supporting thread activity and response timing both point to a
            follow-up move while the conversation is still accelerating.
          </p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground/65">
            Present this as the headline takeaway, then open the modules for proof.
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
          <SectionFeedback
            page="overview"
            targetType="opportunity"
            targetId={creatorToolsFeedbackId("overview", "opportunity", "Primary Opportunity")}
            className="mt-4 border-white/15 bg-black/10"
          />
        </div>

        <div className="rounded-[28px] border border-border/60 bg-background/90 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Supporting proof points
          </p>
          <div className="mt-4 space-y-3">
            {overviewFindings.map((finding) => (
              <Link
                key={finding.title}
                href={finding.href}
                className="block rounded-2xl border border-border/60 bg-secondary/20 p-4 transition-colors hover:bg-secondary/35"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold">{finding.title}</p>
                  <CreatorToolsConfidenceBadge
                    confidence={finding.confidence}
                    className="shrink-0"
                  />
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {finding.summary}
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  {finding.cta}
                  <ArrowRight className="size-3.5" />
                </div>
                <SectionFeedback
                  page="overview"
                  targetType="finding"
                  targetId={creatorToolsFeedbackId("overview", "finding", finding.title)}
                  className="mt-4"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
