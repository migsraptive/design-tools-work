"use client";

import Link from "next/link";
import { ArrowRight, FileText, Sparkles } from "lucide-react";
import { CreatorToolsPrototypeNav } from "@/components/design/creator-tools-prototype-nav";
import { FadeIn } from "@/components/motion/fade-in";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function CreatorToolsOverviewHeader() {
  return (
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
              The Creator Tools hub for understanding signal, locating the right
              audience and conversation layers, and deciding what the creator should
              do next.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/drops/creator-tools/prd">
              PRD / Brief
              <FileText className="size-4" />
            </Link>
          </Button>

          <Button asChild variant="outline" className="rounded-full">
            <Link href="/drops/creator-tools/themes">
              View Theme Signals
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>

      <CreatorToolsPrototypeNav />
    </FadeIn>
  );
}
