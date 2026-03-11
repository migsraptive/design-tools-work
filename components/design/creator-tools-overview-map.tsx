"use client";

import Link from "next/link";
import { ArrowRight, FileText, Layers3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  creatorToolsModules,
  creatorToolsSupportingSurfaces,
} from "@/lib/mock/creator-tools";

export function CreatorToolsOverviewMap() {
  return (
    <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[28px] border border-border/60 bg-card/85 p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <Layers3 className="size-4 text-primary" />
          Product map
        </div>
        <h2 className="mt-2 text-2xl font-black tracking-tight">How Creator Tools is organized</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          The overview should orient the team first. Start with broad signal, move into
          who it matters for, inspect the conversation layer, and only then decide what
          action the creator should take.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {creatorToolsModules.map((module) => (
            <Link
              key={module.href}
              href={module.href}
              className="group rounded-[24px] border border-border/60 bg-background/85 p-5 transition-colors hover:border-primary/30 hover:bg-secondary/20"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-lg font-bold tracking-tight">{module.title}</p>
                <span className="rounded-full border border-border/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {module.status}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {module.summary}
              </p>
              <p className="mt-3 text-xs font-medium uppercase tracking-[0.16em] text-primary">
                {module.cue}
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-foreground">
                Open module
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-[28px] border border-border/60 bg-primary/95 p-5 text-primary-foreground">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary-foreground/75">
            <FileText className="size-4" />
            Artifact
          </div>
          <h3 className="mt-2 text-2xl font-black tracking-tight">PRD / Brief</h3>
          <p className="mt-3 text-sm leading-6 text-primary-foreground/80">
            Keep the PRD separate from the module navigation so it sets context without
            competing with the prototype flow. It should anchor conversation, not behave
            like another feature surface.
          </p>
          <Button asChild size="sm" variant="secondary" className="mt-4">
            <Link href="/drops/creator-tools/prd">
              Open PRD / Brief
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="rounded-[28px] border border-border/60 bg-card/85 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Supporting surfaces
          </p>
          <div className="mt-4 space-y-3">
            {creatorToolsSupportingSurfaces.map((surface) => (
              <Link
                key={surface.href}
                href={surface.href}
                className="block rounded-2xl border border-border/60 bg-background/85 p-4 transition-colors hover:bg-secondary/20"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">{surface.title}</p>
                  <ArrowRight className="size-4 text-muted-foreground" />
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {surface.summary}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
