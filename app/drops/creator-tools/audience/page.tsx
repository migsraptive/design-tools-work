import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import { CreatorToolsShell } from "@/components/design/creator-tools-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { audienceSegments } from "@/lib/mock/creator-tools";

export default function CreatorToolsAudiencePage() {
  return (
    <CreatorToolsShell
      badge="Audience"
      title="Audience Signals"
      description="The member groups deepening conversation, returning to the community, or beginning to drift."
    >
      <section className="overflow-hidden rounded-[32px] border border-border/70 bg-card shadow-sm">
        <div className="border-b border-border/60 px-6 py-5 md:px-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Users className="size-4 text-primary" />
                Audience lens
              </div>
              <h2 className="mt-2 text-2xl font-black tracking-tight md:text-3xl">
                Audience Shifts
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Audience segments clarify where momentum is deepening, where reactivation
                is happening, and where participation may need support.
              </p>
            </div>
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/drops/creator-tools/threads">
                Next: Threads
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 p-6 md:grid-cols-2 md:p-8">
          {audienceSegments.map((segment) => (
            <div
              key={segment.label}
              className="rounded-[28px] border border-border/60 bg-background/90 p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Badge variant="outline" className="rounded-full px-3 py-1">
                    {segment.signal}
                  </Badge>
                  <h3 className="mt-3 text-lg font-bold">{segment.label}</h3>
                </div>
                <div className="rounded-2xl border border-border/60 bg-secondary/25 px-4 py-3 text-right">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Size
                  </p>
                  <p className="mt-1 text-2xl font-black">{segment.size}</p>
                </div>
              </div>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {segment.summary}
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Button asChild size="sm" variant="secondary">
                  <Link href={segment.relatedThreadHref}>Inspect supporting thread</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href={segment.relatedThemeHref}>
                    Related theme: {segment.relatedTheme}
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </CreatorToolsShell>
  );
}
