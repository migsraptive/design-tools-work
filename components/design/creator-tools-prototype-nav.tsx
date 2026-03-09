"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { creatorToolsNav } from "@/lib/mock/creator-tools";

export function CreatorToolsPrototypeNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap gap-2">
      {creatorToolsNav.map((item) => {
        const active =
          item.href === "/drops/creator-tools"
            ? pathname === item.href
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:text-foreground"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
