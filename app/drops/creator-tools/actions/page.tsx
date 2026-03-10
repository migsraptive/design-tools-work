import type { ComponentType } from "react";
import Link from "next/link";
import { BellRing, CalendarClock, Pin, ShieldCheck } from "lucide-react";
import { CreatorToolsShell } from "@/components/design/creator-tools-shell";
import { SectionFeedback } from "@/components/design/section-feedback";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  actionQueue,
  moderationActions,
  nudgeInbox,
  pinnedPosts,
  scheduledPosts,
} from "@/lib/mock/creator-tools";
import { creatorToolsFeedbackId } from "@/lib/mock/creator-tools-feedback";

export default function CreatorToolsActionsPage() {
  return (
    <CreatorToolsShell
      badge="Actions"
      title="Priority Actions"
      description="The clearest next moves, grounded in current themes, audience shifts, and conversation activity."
    >
      <section className="overflow-hidden rounded-[32px] border border-border/70 bg-card shadow-sm">
        <div className="border-b border-border/60 px-6 py-5 md:px-8">
          <div className="flex items-start gap-2 text-sm font-semibold text-muted-foreground">
            <BellRing className="size-4 text-primary" />
            Action layer
          </div>
          <h2 className="mt-2 text-2xl font-black tracking-tight md:text-3xl">
            Recommended Moves
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Each recommendation below is tied to a current signal in themes, audience
            movement, or thread-level activity.
          </p>
        </div>

        <div className="grid gap-4 p-6 xl:grid-cols-[1.15fr_0.85fr] md:p-8">
          <div className="rounded-[28px] border border-border/60 bg-background/90 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Prioritized actions
            </p>
            <div className="mt-4 space-y-3">
              {actionQueue.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-border/60 bg-secondary/25 p-4"
                >
                  <Link href={item.href} className="block transition-colors hover:text-foreground">
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.note}</p>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      {item.source}
                    </p>
                  </Link>
                  <SectionFeedback
                    page="actions"
                    targetType="action"
                    targetId={creatorToolsFeedbackId("actions", "action", item.title)}
                    className="mt-4"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[28px] border border-border/60 bg-primary/95 p-5 text-primary-foreground">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground/70">
                Decision Path
              </p>
              <p className="mt-3 text-sm leading-6 text-primary-foreground/80">
                Meal prep systems are moving from strong theme momentum into unanswered
                thread activity and a timely follow-up publishing window.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild size="sm" variant="secondary">
                  <Link href="/drops/creator-tools/nudges/high-signal-question">
                    Open response opportunity
                  </Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  <Link href="/drops/creator-tools/controls/scheduler">Open publishing controls</Link>
                </Button>
              </div>
            </div>

            <div className="rounded-[28px] border border-border/60 bg-background/90 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Response Opportunities
              </p>
              <div className="mt-4 space-y-3">
              {nudgeInbox.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-border/60 bg-secondary/25 p-4"
                  >
                    <Link href={item.href} className="block transition-colors hover:text-foreground">
                      <div className="flex items-center justify-between gap-3">
                        <Badge variant="outline" className="rounded-full px-3 py-1">
                          {item.type}
                        </Badge>
                        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                          {item.priority}
                        </span>
                      </div>
                      <p className="mt-3 text-sm font-semibold">{item.title}</p>
                    </Link>
                    <SectionFeedback
                      page="actions"
                      targetType="action"
                      targetId={creatorToolsFeedbackId("actions", "action", item.title)}
                      className="mt-4"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 border-t border-border/60 p-6 xl:grid-cols-3 md:p-8">
          <ActionPanel
            icon={CalendarClock}
            title="Scheduling"
            items={scheduledPosts.map((post) => ({
              title: post.title,
              detail: `${post.publishAt} • ${post.source}`,
              href: post.href,
            }))}
          />
          <ActionPanel
            icon={Pin}
            title="Pinning & placement"
            items={pinnedPosts.map((post) => ({
              title: post.title,
              detail: post.note,
              href: "/drops/creator-tools/controls/pins",
            }))}
          />
          <ActionPanel
            icon={ShieldCheck}
            title="Moderation & review"
            items={moderationActions.map((action) => ({
              title: action.title,
              detail: action.note,
              href: action.href,
            }))}
          />
        </div>
      </section>
    </CreatorToolsShell>
  );
}

function ActionPanel({
  icon: Icon,
  title,
  items,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  items: { title: string; detail: string; href: string }[];
}) {
  return (
    <div className="rounded-[28px] border border-border/60 bg-background/90 p-5">
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-primary" />
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {title}
        </p>
      </div>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="block rounded-2xl border border-border/60 bg-secondary/25 p-4 transition-colors hover:bg-secondary/40"
          >
            <p className="text-sm font-semibold">{item.title}</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.detail}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
