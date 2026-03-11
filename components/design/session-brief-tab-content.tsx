"use client";

import type { ExplorationSession, SessionValidation } from "@/lib/design-types";
import { SessionBrief } from "@/components/design/session-brief";
import { SessionValidationCard } from "@/components/design/session-validation-card";

export function SessionBriefTabContent({
  session,
  isCreator,
  onUpdateValidation,
}: {
  session: ExplorationSession;
  isCreator: boolean;
  onUpdateValidation: (updates: Partial<SessionValidation>) => Promise<void>;
}) {
  return (
    <div className="space-y-4">
      <SessionBrief session={session} />
      <SessionValidationCard
        session={session}
        isCreator={isCreator}
        onUpdate={onUpdateValidation}
      />
    </div>
  );
}
