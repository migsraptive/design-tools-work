import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import { CreatorToolsShell } from "@/components/design/creator-tools-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { themes } from "@/lib/mock/creator-tools";

export default function CreatorToolsThemesPage() {
  return (
    <CreatorToolsShell
      badge="Themes"
      title="Theme Momentum"
      description="The topics shaping engagement, repeat visits, and conversation depth across the community."
    >
      <section className="overflow-hidden rounded-[32px] border border-border/70 bg-card shadow-sm">
        <div className="border-b border-border/60 px-6 py-5 md:px-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <TrendingUp className="size-4 text-primary" />
                Theme momentum
              </div>
              <h2 className="mt-2 text-2xl font-black tracking-tight md:text-3xl">
                Leading Themes
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Themes explain the broad movement in the community and clarify which
                conversations are pulling the most engagement right now.
              </p>
            </div>
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/drops/creator-tools/audience">
                Next: Audience
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 p-6 md:p-8">
          {themes.map((item, index) => (
            <div
              key={item.theme}
              className="rounded-[28px] border border-border/60 bg-background/90 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="rounded-full px-3 py-1 text-[10px]">
                      #{index + 1}
                    </Badge>
                    <Badge
                      variant={item.status === "rising" ? "secondary" : "outline"}
                      className="rounded-full px-3 py-1"
                    >
                      {item.status}
                    </Badge>
                  </div>
                  <h3 className="mt-3 text-lg font-bold">{item.theme}</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                    {item.summary}
                  </p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-secondary/25 px-4 py-3 text-right">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Momentum
                  </p>
                  <p className="mt-1 text-2xl font-black">{item.momentum}</p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Button asChild size="sm" variant="secondary">
                  <Link href={item.relatedThreadHref}>View supporting threads</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href={item.relatedAudienceHref}>
                    Related audience: {item.relatedAudience}
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
