import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CreatorToolsPrototypeNav } from "@/components/design/creator-tools-prototype-nav";
import { FadeIn } from "@/components/motion/fade-in";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function CreatorToolsShell({
  badge,
  title,
  description,
  backHref = "/drops/creator-tools",
  backLabel = "Back to Overview",
  children,
}: {
  badge: string;
  title: string;
  description: string;
  backHref?: string;
  backLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-w-0 space-y-6">
      <FadeIn className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="rounded-full px-3 py-1">
                Project Drop
              </Badge>
              <Badge variant="outline" className="rounded-full px-3 py-1">
                {badge}
              </Badge>
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight md:text-4xl">{title}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            </div>
          </div>

          <Button asChild variant="outline" className="rounded-full">
            <Link href={backHref}>
              <ArrowLeft className="size-4" />
              {backLabel}
            </Link>
          </Button>
        </div>

        <CreatorToolsPrototypeNav />
      </FadeIn>

      <FadeIn delay={0.05} className="w-full">
        {children}
      </FadeIn>
    </div>
  );
}
