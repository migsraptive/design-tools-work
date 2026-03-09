import { BarChart3, MessageSquareQuote, TrendingUp } from "lucide-react";
import { CreatorToolsShell } from "@/components/design/creator-tools-shell";
import { Badge } from "@/components/ui/badge";

export default function CreatorToolsTopPostPage() {
  return (
    <CreatorToolsShell
      badge="Analytics Detail"
      title="Top Post Performance"
      description="Mock drill-in for the highest-performing community post, showing why it is resonating and what the creator should do next."
    >
      <section className="overflow-hidden rounded-[32px] border border-border/70 bg-card shadow-sm">
        <div className="border-b border-border/60 px-6 py-5 md:px-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <BarChart3 className="size-4 text-primary" />
                Post detail
              </div>
              <h2 className="mt-2 text-2xl font-black tracking-tight">
                How I batch a week of dinners in 90 minutes
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                This thread is outperforming the rest of the week on both pageviews and
                sustained comment depth.
              </p>
            </div>
            <Badge variant="secondary" className="rounded-full px-3 py-1">
              Top post this week
            </Badge>
          </div>
        </div>

        <div className="grid gap-4 p-6 md:grid-cols-3 md:p-8">
          <DetailStat label="Views" value="8.4K" note="+21% vs creator average" />
          <DetailStat label="Comments" value="214" note="37 still unresolved" />
          <DetailStat label="Engagement rate" value="6.8%" note="Best-performing format: checklist + photo" />
        </div>

        <div className="grid gap-4 border-t border-border/60 p-6 lg:grid-cols-[1.1fr_0.9fr] md:p-8">
          <div className="rounded-[24px] border border-border/60 bg-secondary/20 p-5">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-primary" />
              <p className="text-sm font-semibold">What is driving performance</p>
            </div>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <p>The post landed inside the creator’s strongest morning window.</p>
              <p>Readers are quoting the checklist format back to each other in replies.</p>
              <p>Notification traffic is unusually high, which suggests creator presence will compound the thread further.</p>
            </div>
          </div>

          <div className="rounded-[24px] border border-border/60 bg-secondary/20 p-5">
            <div className="flex items-center gap-2">
              <MessageSquareQuote className="size-4 text-primary" />
              <p className="text-sm font-semibold">Recommended next step</p>
            </div>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <p>Reply to the top unanswered reader question.</p>
              <p>Schedule a follow-up variation for Thursday morning.</p>
              <p>Reuse the “90-minute system” framing as the next conversation starter.</p>
            </div>
          </div>
        </div>
      </section>
    </CreatorToolsShell>
  );
}

function DetailStat({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-[24px] border border-border/60 bg-background/90 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-3 text-3xl font-black tracking-tight">{value}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{note}</p>
    </div>
  );
}
