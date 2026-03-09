import Link from "next/link";
import { ArrowLeft, BellRing, Mail, MessageSquareQuote, Settings2, Sparkles } from "lucide-react";
import { CreatorToolsPrototypeNav } from "@/components/design/creator-tools-prototype-nav";
import { FadeIn } from "@/components/motion/fade-in";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { experimentStats, nudgeInbox, nudgeKpis, nudgePreferences } from "@/lib/mock/creator-tools";

export default function CreatorToolsNudgesPage() {
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
                Nudges
              </Badge>
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight md:text-4xl">
                AI-Driven Engagement Nudges
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Mock inbox and configuration surfaces showing how creator nudges can stay
                specific, actionable, and low-noise.
              </p>
            </div>
          </div>

          <Button asChild variant="outline" className="rounded-full">
            <Link href="/drops/creator-tools/controls">
              <ArrowLeft className="size-4" />
              Back to Controls
            </Link>
          </Button>
        </div>

        <CreatorToolsPrototypeNav />
      </FadeIn>

      <FadeIn delay={0.05} className="w-full">
        <section className="overflow-hidden rounded-[32px] border border-border/70 bg-[linear-gradient(180deg,_rgba(255,255,255,0.96),_rgba(244,244,245,0.98))] shadow-sm dark:bg-[linear-gradient(180deg,_rgba(24,24,27,0.96),_rgba(39,39,42,0.98))]">
          <div className="border-b border-border/60 px-6 py-5 md:px-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <BellRing className="size-4 text-primary" />
                  Engagement assistant
                </div>
                <h2 className="text-2xl font-black tracking-tight md:text-3xl">
                  Help creators show up at the right moment
                </h2>
                <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                  The system prioritizes urgency and specificity, then lets creators tune
                  cadence so nudges feel like a trusted assistant instead of noise.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="secondary" className="rounded-full px-3 py-1">
                  Daily digest default
                </Badge>
                <Badge variant="outline" className="rounded-full px-3 py-1">
                  Mock data
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-4 md:p-8">
            {nudgeKpis.map((item) => (
              <div key={item.label} className="rounded-[24px] border border-border/60 bg-background/90 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {item.label}
                </p>
                <p className="mt-3 text-3xl font-black tracking-tight">{item.value}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.detail}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-4 border-t border-border/60 bg-secondary/20 p-6 xl:grid-cols-[1.05fr_0.95fr] md:p-8">
            <div className="rounded-[28px] border border-border/60 bg-background/90 p-5">
              <div className="flex items-center gap-2">
                <MessageSquareQuote className="size-4 text-primary" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Nudge inbox
                </p>
              </div>
              <div className="mt-5 space-y-3">
                {nudgeInbox.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="group block rounded-2xl border border-border/60 bg-secondary/20 p-4 transition-colors hover:bg-secondary/35 hover:border-primary/30"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <Badge variant="outline" className="rounded-full px-3 py-1">
                        {item.type}
                      </Badge>
                      <span className="text-sm font-medium text-primary underline-offset-4 group-hover:underline">
                        {item.priority}
                      </span>
                    </div>
                    <p className="mt-3 text-sm font-semibold">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.body}</p>
                    <p className="mt-3 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                      Open detail
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[28px] border border-border/60 bg-primary/95 p-5 text-primary-foreground">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground/70">
                  Digest preview
                </p>
                <div className="mt-4 rounded-2xl border border-primary-foreground/15 bg-black/10 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Mail className="size-4" />
                    Today’s creator opportunities
                  </div>
                  <p className="mt-3 text-sm leading-6 text-primary-foreground/80">
                    1 high-signal question, 1 lapsed reader opportunity, and 1 conversation
                    starter are ready for review.
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button asChild size="sm" variant="secondary">
                    <Link href="/drops/creator-tools/nudges/high-signal-question">Open top nudge</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white">
                    <Link href="/drops/creator-tools/controls/scheduler">Turn into scheduled post</Link>
                  </Button>
                </div>
              </div>

              <div className="rounded-[28px] border border-border/60 bg-background/90 p-5">
                <div className="flex items-center gap-2">
                  <Settings2 className="size-4 text-primary" />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Preferences
                  </p>
                </div>
                <div className="mt-5 space-y-3">
                  {nudgePreferences.map((item) => (
                    <div key={item.label} className="flex items-center justify-between gap-4 rounded-2xl border border-border/60 bg-secondary/20 px-4 py-3">
                      <span className="text-sm font-medium">{item.label}</span>
                      <span className="text-sm text-muted-foreground">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 border-t border-border/60 p-6 md:grid-cols-3 md:p-8">
            {experimentStats.map((item) => (
              <div key={item.label} className="rounded-[28px] border border-border/60 bg-background/90 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {item.label}
                </p>
                <p className="mt-3 text-3xl font-black tracking-tight">{item.value}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.note}</p>
              </div>
            ))}
          </div>
        </section>
      </FadeIn>
    </div>
  );
}
