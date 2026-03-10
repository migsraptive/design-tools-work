import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const sections = [
  {
    title: "Overview",
    body:
      "Creators on Raptive Community lack the insights and controls they need to engage audiences consistently. V1 focuses on reducing friction, surfacing signal, and using helpful nudges to keep creators active.",
  },
  {
    title: "V1 feature areas",
    body:
      "Post and community controls, analytics dashboard, and AI-driven engagement nudges. The intended sequence starts with reducing friction, then clarifying performance, then prompting timely follow-through.",
  },
  {
    title: "Design plan",
    body:
      "Discovery with creator interviews and analytics audit, concept prototyping, high-fidelity design/spec, then build support and beta rollout with instrumentation.",
  },
  {
    title: "Success metrics",
    body:
      "Posting frequency, creator habit formation, session depth, nudge response rate, and lapsed reader re-engagement within 90 days of launch.",
  },
];

export default function CreatorToolsPrdPage() {
  return (
    <div className="w-full min-w-0 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1 rounded-full px-3 py-1">
              <FileText className="size-3.5" />
              PRD Reference
            </Badge>
            <Badge variant="outline" className="rounded-full px-3 py-1">
              March 2026
            </Badge>
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight md:text-4xl">
              Creator Tools PRD
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Internal product reference. This document is intentionally outside the
              primary creator-tools navigation.
            </p>
          </div>
        </div>

        <Button asChild variant="outline" className="rounded-full">
          <Link href="/drops/creator-tools">
            <ArrowLeft className="size-4" />
            Back to prototype
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {sections.map((section) => (
          <section
            key={section.title}
            className="rounded-[24px] border border-border/60 bg-card/85 p-6"
          >
            <h2 className="text-lg font-bold tracking-tight">{section.title}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
              {section.body}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
