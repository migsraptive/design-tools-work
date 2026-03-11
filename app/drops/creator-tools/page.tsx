"use client";

import { FadeIn } from "@/components/motion/fade-in";
import { CreatorToolsOverviewHeader } from "@/components/design/creator-tools-overview-header";
import { CreatorToolsOverviewMap } from "@/components/design/creator-tools-overview-map";
import { CreatorToolsOverviewSignal } from "@/components/design/creator-tools-overview-signal";

export default function CreatorToolsDropPage() {
  return (
    <div className="w-full min-w-0 space-y-6">
      <CreatorToolsOverviewHeader />

      <FadeIn delay={0.03} className="w-full">
        <CreatorToolsOverviewMap />
      </FadeIn>

      <FadeIn delay={0.05} className="w-full">
        <section className="overflow-hidden rounded-[32px] border border-border/70 bg-[linear-gradient(180deg,_rgba(255,255,255,0.94),_rgba(244,244,245,0.98))] shadow-sm dark:bg-[linear-gradient(180deg,_rgba(24,24,27,0.96),_rgba(39,39,42,0.98))]">
          <CreatorToolsOverviewSignal />
        </section>
      </FadeIn>
    </div>
  );
}
