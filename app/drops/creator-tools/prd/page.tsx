import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { BriefArtifact, creatorToolsBriefFields } from "@/components/design/brief-artifact";
import { BriefFramingSequence } from "@/components/design/brief-framing-sequence";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const designPlanSections = [
  {
    title: "V1 feature areas",
    body:
      "Post and community controls, analytics dashboard, and AI-driven engagement nudges. The sequence starts by reducing friction, then clarifying performance, then prompting timely follow-through.",
  },
  {
    title: "Design plan",
    body:
      "Discovery with creator interviews and analytics audit, concept prototyping, high-fidelity design/spec, then build support and beta rollout with instrumentation.",
  },
  {
    title: "Primary design principle",
    body:
      "Lead creators toward the next useful action. The interface should make outcomes obvious instead of dumping raw controls or analytics without interpretation.",
  },
];

const researchSections = [
  {
    title: "Research foundation",
    body:
      "Current assumptions center on posting friction, weak visibility into engagement signal, and the need for more useful creator-side controls. Sprint 0 should validate what data creators actually want and when AI nudges feel helpful.",
  },
  {
    title: "Recommended research",
    body:
      "Run creator interviews, audit engagement patterns across top creators, and validate whether creators respond better to opinionated analytics summaries than configurable dashboards.",
  },
  {
    title: "Success metrics",
    body:
      "Posting frequency, creator habit formation, session depth, nudge response rate, and lapsed reader re-engagement within 90 days of launch.",
  },
];

function SectionCard({ title, body }: { title: string; body: string }) {
  return (
    <section className="rounded-[24px] border border-border/60 bg-card/85 p-6">
      <h2 className="text-lg font-bold tracking-tight">{title}</h2>
      <p className="mt-2 text-sm leading-7 text-muted-foreground">
        {body}
      </p>
    </section>
  );
}

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

      <Tabs defaultValue="brief" className="gap-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="brief">PRD / Brief</TabsTrigger>
          <TabsTrigger value="design-plan">Design Plan</TabsTrigger>
          <TabsTrigger value="research">Research</TabsTrigger>
        </TabsList>

        <TabsContent value="brief" className="space-y-4">
          <BriefFramingSequence />
          <BriefArtifact fields={creatorToolsBriefFields} />
        </TabsContent>

        <TabsContent value="design-plan" className="space-y-4">
          <div className="grid gap-4">
            {designPlanSections.map((section) => (
              <SectionCard key={section.title} {...section} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="research" className="space-y-4">
          <div className="grid gap-4">
            {researchSections.map((section) => (
              <SectionCard key={section.title} {...section} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
