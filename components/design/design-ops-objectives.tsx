"use client";

import { useMemo, useState } from "react";
import { History, Plus, Target, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Objective } from "@/lib/design-ops-types";
import {
  DesignOpsObjectiveFields,
  makeDefaultObjectiveFormValues,
  type ObjectiveFormValues,
} from "@/components/design/design-ops-objective-fields";

interface DesignOpsObjectivesProps {
  objectives: Objective[];
  activeObjectiveId: string | null;
  onActiveObjectiveChange: (id: string | null) => void;
  onAdd: (obj: Omit<Objective, "id" | "createdAt">) => Promise<Objective | null>;
  onUpdate: (id: string, obj: Omit<Objective, "id" | "createdAt">) => Promise<Objective | null>;
  onDelete: (id: string) => void;
}

interface ObjectiveEditorProps {
  objective: Objective | null;
  onActivateNew: () => void;
  onAdd: (obj: Omit<Objective, "id" | "createdAt">) => Promise<Objective | null>;
  onUpdate: (id: string, obj: Omit<Objective, "id" | "createdAt">) => Promise<Objective | null>;
  onActiveObjectiveChange: (id: string | null) => void;
}

function objectiveToFormValues(objective: Objective): ObjectiveFormValues {
  return {
    title: objective.title,
    metric: objective.metric,
    target: objective.target,
    description: objective.description,
    type: objective.type,
    stage: objective.stage,
    segmentIds: objective.segmentIds,
    lifecycleCohorts: objective.lifecycleCohorts,
    theoryOfSuccess: objective.theoryOfSuccess ?? "",
    owner: objective.owner ?? "",
  };
}

function ObjectiveEditor({
  objective,
  onActivateNew,
  onAdd,
  onUpdate,
  onActiveObjectiveChange,
}: ObjectiveEditorProps) {
  const [showAdvanced, setShowAdvanced] = useState(
    Boolean(objective?.owner || objective?.type !== "product")
  );
  const [draftValues, setDraftValues] = useState<ObjectiveFormValues>(
    objective ? objectiveToFormValues(objective) : makeDefaultObjectiveFormValues()
  );

  const handleSave = async () => {
    if (!draftValues.title || !draftValues.metric) return;

    if (objective) {
      await onUpdate(objective.id, draftValues);
      return;
    }

    const created = await onAdd(draftValues);
    if (created) {
      onActiveObjectiveChange(created.id);
    }
  };

  return (
    <Card className="border-dashed">
      <CardContent className="space-y-4 px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Target className="size-4 text-muted-foreground" />
            <p className="text-sm font-semibold">
              {objective ? "Current objective" : "New objective"}
            </p>
          </div>
          {objective ? (
            <Button type="button" size="sm" variant="ghost" onClick={onActivateNew}>
              <Plus className="mr-2 size-4" />
              New objective
            </Button>
          ) : null}
        </div>

        <DesignOpsObjectiveFields
          value={draftValues}
          onChange={setDraftValues}
          showAdvanced={showAdvanced}
          onShowAdvancedChange={setShowAdvanced}
          appearance="inline"
        />

        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave} disabled={!draftValues.title || !draftValues.metric}>
            {objective ? "Save objective" : "Create objective"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() =>
              setDraftValues(
                objective ? objectiveToFormValues(objective) : makeDefaultObjectiveFormValues()
              )
            }
          >
            {objective ? "Reset changes" : "Clear"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function DesignOpsObjectives({
  objectives,
  activeObjectiveId,
  onActiveObjectiveChange,
  onAdd,
  onUpdate,
  onDelete,
}: DesignOpsObjectivesProps) {
  const activeObjective = useMemo(
    () => objectives.find((objective) => objective.id === activeObjectiveId) ?? null,
    [activeObjectiveId, objectives]
  );
  const previousObjectives = useMemo(
    () => objectives.filter((objective) => objective.id !== activeObjectiveId),
    [activeObjectiveId, objectives]
  );

  const handleStartNew = () => {
    onActiveObjectiveChange(null);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Business Objectives
        </h3>
        <p className="text-sm text-muted-foreground">
          Work from one active objective at a time, then return to earlier briefs if needed.
        </p>
      </div>

      <ObjectiveEditor
        key={activeObjective?.id ?? "new-objective"}
        objective={activeObjective}
        onActivateNew={handleStartNew}
        onAdd={onAdd}
        onUpdate={onUpdate}
        onActiveObjectiveChange={onActiveObjectiveChange}
      />

      {previousObjectives.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <History className="size-4 text-muted-foreground" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Previous objectives
            </p>
          </div>

          <div className="space-y-3">
            {previousObjectives.map((objective) => (
              <Card key={objective.id} className="w-full">
                <CardContent className="flex items-start justify-between gap-3 px-4 py-3">
                  <div className="min-w-0 flex-1 space-y-2">
                    <p className="text-sm font-semibold text-foreground">{objective.title}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{objective.metric}</Badge>
                      <Badge variant="outline">{objective.stage.replaceAll("_", " ")}</Badge>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => onActiveObjectiveChange(objective.id)}
                    >
                      Load
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      aria-label={`Delete objective ${objective.title}`}
                      onClick={() => onDelete(objective.id)}
                    >
                      <Trash2 className="size-4 text-muted-foreground" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
