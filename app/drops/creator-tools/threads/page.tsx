import Link from "next/link";
import { ArrowRight, MessageSquareQuote } from "lucide-react";
import { CreatorToolsShell } from "@/components/design/creator-tools-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { threadSignals, topPosts } from "@/lib/mock/creator-tools";

export default function CreatorToolsThreadsPage() {
  return (
    <CreatorToolsShell
      badge="Threads"
      title="Conversation Signals"
      description="The posts, replies, and discussion clusters behind the strongest community patterns."
    >
      <section className="overflow-hidden rounded-[32px] border border-border/70 bg-card shadow-sm">
        <div className="border-b border-border/60 px-6 py-5 md:px-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <MessageSquareQuote className="size-4 text-primary" />
                Evidence layer
              </div>
              <h2 className="mt-2 text-2xl font-black tracking-tight md:text-3xl">
                Supporting Evidence
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                These conversations explain the strongest patterns in the community and
                show where the current momentum is taking shape.
              </p>
            </div>
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/drops/creator-tools/actions">
                Next: Actions
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 p-6 xl:grid-cols-[1.05fr_0.95fr] md:p-8">
          <div className="rounded-[28px] border border-border/60 bg-background/90 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Breakout conversations
            </p>
            <div className="mt-4 space-y-3">
              {threadSignals.map((thread) => (
                <Link
                  key={thread.title}
                  href={thread.href}
                  className="block rounded-2xl border border-border/60 bg-secondary/25 p-4 transition-colors hover:bg-secondary/40"
                >
                  <Badge variant="outline" className="rounded-full px-3 py-1">
                    {thread.signal}
                  </Badge>
                  <p className="mt-3 text-sm font-semibold">{thread.title}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{thread.body}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-border/60 bg-background/90 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Top posts and threads
            </p>
            <div className="mt-4 space-y-3">
              {topPosts.map((post, index) => (
                <Link
                  key={post.title}
                  href={post.href}
                  className="block rounded-2xl border border-border/60 bg-secondary/25 p-4 transition-colors hover:bg-secondary/40"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold">{post.title}</p>
                    <Badge variant="outline" className="rounded-full px-3 py-1 text-[10px]">
                      #{index + 1}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {post.views.toLocaleString()} views • {post.engagement}% engagement
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </CreatorToolsShell>
  );
}
