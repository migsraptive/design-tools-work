import { MessageSquareQuote, WandSparkles } from "lucide-react";
import { CreatorToolsShell } from "@/components/design/creator-tools-shell";

export default function CreatorToolsConversationStarterPage() {
  return (
    <CreatorToolsShell
      badge="Nudge Detail"
      title="Conversation Starter"
      description="Static prompt generation state for low-activity days, with AI-suggested prompts based on recent engagement themes."
      backHref="/drops/creator-tools/nudges"
      backLabel="Back to Nudges"
    >
      <section className="overflow-hidden rounded-[32px] border border-border/70 bg-card shadow-sm">
        <div className="grid gap-4 p-6 md:grid-cols-3 md:p-8">
          {[
            "What pantry shortcut saves you the most money each week?",
            "What meal do you always prep first when life gets chaotic?",
            "Which grocery reset habit changed your week the most?",
          ].map((prompt, index) => (
            <div key={prompt} className="rounded-[24px] border border-border/60 bg-secondary/20 p-5">
              <div className="flex items-center gap-2">
                {index === 0 ? <WandSparkles className="size-4 text-primary" /> : <MessageSquareQuote className="size-4 text-primary" />}
                <p className="text-sm font-semibold">Prompt option {index + 1}</p>
              </div>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">{prompt}</p>
            </div>
          ))}
        </div>
      </section>
    </CreatorToolsShell>
  );
}
