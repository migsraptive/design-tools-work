import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarClock, Pin, ShieldCheck, Sparkles, Users } from "lucide-react";
import { CreatorToolsPrototypeNav } from "@/components/design/creator-tools-prototype-nav";
import { FadeIn } from "@/components/motion/fade-in";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  controlsKpis,
  moderationActions,
  pinnedPosts,
  postingCalendar,
  scheduledPosts,
} from "@/lib/mock/creator-tools";

export default function CreatorToolsControlsPage() {
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
                Legacy Subsurface
              </Badge>
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight md:text-4xl">
                Publishing Controls
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Execution tools for scheduling, pinning, moderation, and delegated
                publishing. In the new IA, this surface supports actions rather than
                leading the workflow.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/drops/creator-tools/actions">
                <ArrowLeft className="size-4" />
                Back to Actions
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/drops/creator-tools/actions">
                Open Actions
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>

        <CreatorToolsPrototypeNav />
      </FadeIn>

      <FadeIn delay={0.05} className="w-full">
        <section className="overflow-hidden rounded-[32px] border border-border/70 bg-[linear-gradient(180deg,_rgba(255,255,255,0.96),_rgba(244,244,245,0.98))] shadow-sm dark:bg-[linear-gradient(180deg,_rgba(24,24,27,0.96),_rgba(39,39,42,0.98))]">
          <div className="border-b border-border/60 px-6 py-5 md:px-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <CalendarClock className="size-4 text-primary" />
                  Execution tools
                </div>
                <h2 className="text-2xl font-black tracking-tight md:text-3xl">
                  Operational Controls
                </h2>
                <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                  Use these controls after the priority has been identified. This surface
                  handles execution, approval, and placement.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="secondary" className="rounded-full px-3 py-1">
                  Mock workflow
                </Badge>
                <Badge variant="outline" className="rounded-full px-3 py-1">
                  Static clickthrough
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-4 md:p-8">
            {controlsKpis.map((item) => (
              <div key={item.label} className="rounded-[24px] border border-border/60 bg-background/90 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {item.label}
                </p>
                <p className="mt-3 text-3xl font-black tracking-tight">{item.value}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.detail}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-4 border-t border-border/60 bg-secondary/20 p-6 xl:grid-cols-[1.1fr_0.9fr] md:p-8">
            <div className="rounded-[28px] border border-border/60 bg-background/90 p-5">
              <div className="flex items-center gap-2">
                <CalendarClock className="size-4 text-primary" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Scheduled queue
                </p>
              </div>
              <div className="mt-5 space-y-3">
                {scheduledPosts.map((post) => (
                  <Link key={post.title} href={post.href} className="block rounded-2xl border border-border/60 bg-secondary/20 p-4 transition-colors hover:bg-secondary/35">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">{post.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {post.publishAt} • {post.source}
                        </p>
                      </div>
                      <Badge variant={post.status === "Scheduled" ? "secondary" : "outline"} className="rounded-full px-3 py-1">
                        {post.status}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-border/60 bg-primary/95 p-5 text-primary-foreground">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground/70">
                Team posting policy
              </p>
              <p className="mt-3 text-lg font-bold leading-7">
                Posts can go out as the creator, but the UI always shows “Posted by Team”
                in metadata when a delegate publishes.
              </p>
              <div className="mt-5 rounded-2xl border border-primary-foreground/15 bg-black/10 p-4">
                <p className="text-sm font-semibold">Preview metadata</p>
                <p className="mt-2 text-sm text-primary-foreground/80">
                  By Miguel Arias • Posted by Team • Scheduled for Thu at 9:00 AM
                </p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild size="sm" variant="secondary">
                  <Link href="/drops/creator-tools/controls/team-review">Review team draft</Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white">
                  <Link href="/drops/creator-tools/controls/scheduler">Open scheduler</Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 border-t border-border/60 p-6 xl:grid-cols-[0.9fr_0.9fr_1.1fr] md:p-8">
            <div className="rounded-[28px] border border-border/60 bg-background/90 p-5">
              <div className="flex items-center gap-2">
                <Pin className="size-4 text-primary" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Pinned posts
                </p>
              </div>
              <div className="mt-5 space-y-3">
                {pinnedPosts.map((post) => (
                  <Link key={post.title} href="/drops/creator-tools/controls/pins" className="block rounded-2xl border border-border/60 bg-secondary/20 p-4 transition-colors hover:bg-secondary/35">
                    <p className="text-sm font-semibold">{post.title}</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{post.note}</p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-border/60 bg-background/90 p-5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Moderation actions
                </p>
              </div>
              <div className="mt-5 space-y-3">
                {moderationActions.map((action) => (
                  <Link key={action.title} href={action.href} className="block rounded-2xl border border-border/60 bg-secondary/20 p-4 transition-colors hover:bg-secondary/35">
                    <p className="text-sm font-semibold">{action.title}</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{action.note}</p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-border/60 bg-background/90 p-5">
              <div className="flex items-center gap-2">
                <Users className="size-4 text-primary" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Weekly calendar
                </p>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {postingCalendar.map((item) => (
                  <div
                    key={item.day}
                    className={`rounded-2xl border p-4 ${
                      item.emphasis
                        ? "border-primary/30 bg-primary/8"
                        : "border-border/60 bg-secondary/20"
                    }`}
                  >
                    <p className="text-sm font-semibold">{item.day}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{item.slot}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </FadeIn>
    </div>
  );
}
