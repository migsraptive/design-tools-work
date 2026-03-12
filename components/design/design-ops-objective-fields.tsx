"use client";

import { useId } from "react";
import {
  designOpsSegments,
  growthMetricOptions,
  growthStageOptions,
  lifecycleCohortOptions,
  objectiveTypeOptions,
} from "@/lib/mock/design-ops-growth-context";
import type { Objective } from "@/lib/design-ops-types";
import { DesignOpsMultiSelect } from "@/components/design/design-ops-multi-select";
import { LiveDraftHeaderFields } from "@/components/design/live-draft-header-fields";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export type ObjectiveFormValues = Omit<Objective, "id" | "createdAt">;

interface DesignOpsObjectiveFieldsProps {
  value: ObjectiveFormValues;
  onChange: (next: ObjectiveFormValues) => void;
  showAdvanced: boolean;
  onShowAdvancedChange: (next: boolean) => void;
  appearance?: "default" | "inline";
}

export function makeDefaultObjectiveFormValues(): ObjectiveFormValues {
  return {
    title: "",
    metric: growthMetricOptions[0]?.value ?? "",
    target: "",
    description: "",
    type: objectiveTypeOptions[0]?.value ?? "product",
    stage: growthStageOptions[0]?.value ?? "q2_learn",
    segmentIds: [],
    lifecycleCohorts: [],
    theoryOfSuccess: "",
    owner: "",
  };
}

export function DesignOpsObjectiveFields({
  value,
  onChange,
  showAdvanced,
  onShowAdvancedChange,
  appearance = "default",
}: DesignOpsObjectiveFieldsProps) {
  const idBase = useId();
  const update = <K extends keyof ObjectiveFormValues>(
    key: K,
    nextValue: ObjectiveFormValues[K]
  ) => {
    onChange({ ...value, [key]: nextValue });
  };

  const toggleSegment = (segmentId: string) => {
    update(
      "segmentIds",
      value.segmentIds.includes(segmentId)
        ? value.segmentIds.filter((id) => id !== segmentId)
        : [...value.segmentIds, segmentId]
    );
  };

  const toggleLifecycleCohort = (cohort: string) => {
    update(
      "lifecycleCohorts",
      value.lifecycleCohorts.includes(cohort)
        ? value.lifecycleCohorts.filter((entry) => entry !== cohort)
        : [...value.lifecycleCohorts, cohort]
    );
  };

  const isInline = appearance === "inline";
  const inlineInputClassName =
    "w-full border-none bg-transparent px-0 shadow-none outline-none ring-0 placeholder:text-lg placeholder:text-muted-foreground/35 focus-visible:ring-0 focus-visible:ring-offset-0";
  const inlineBodyClassName = `${inlineInputClassName} text-base text-muted-foreground resize-none`;

  return (
    <div className="space-y-3">
      {isInline ? (
        <LiveDraftHeaderFields
          titleId={`${idBase}-title`}
          descriptionId={`${idBase}-description`}
          titleLabel="Objective"
          descriptionLabel="Problem / Opportunity"
          titlePlaceholder="What outcome are we trying to move?"
          descriptionPlaceholder="What friction, gap, or growth opportunity makes this worth solving?"
          titleValue={value.title}
          descriptionValue={value.description}
          onTitleChange={(next) => update("title", next)}
          onDescriptionChange={(next) => update("description", next)}
          descriptionRows={2}
          density="inline"
          emphasis="large"
          titleTone="field"
        />
      ) : (
        <>
          <div className="space-y-1">
            <Label htmlFor={`${idBase}-title`} className="text-sm font-semibold">
              Objective
            </Label>
            <p className="text-xs leading-5 text-muted-foreground">
              Frame this like a decision brief, not a taxonomy record.
            </p>
          </div>
          <Input
            id={`${idBase}-title`}
            placeholder="Objective (e.g., Improve content match discovery from onboarding interests)"
            value={value.title}
            onChange={(e) => update("title", e.target.value)}
          />
          <div className="space-y-1">
            <Label htmlFor={`${idBase}-description`} className="text-sm font-semibold">
              Problem / Opportunity
            </Label>
            <p className="text-xs leading-5 text-muted-foreground">
              What friction, gap, or growth opportunity are we trying to address?
            </p>
          </div>
          <Textarea
            id={`${idBase}-description`}
            placeholder="Users currently select interests in onboarding, but we only translate that into a flat list of community categories. We should use interests across discovery, feed, email, and re-engagement."
            value={value.description}
            onChange={(e) => update("description", e.target.value)}
            rows={3}
          />
        </>
      )}
      <div className="space-y-1">
        <Label htmlFor={`${idBase}-target`} className="text-sm font-semibold">
          Target
        </Label>
        <Input
          id={`${idBase}-target`}
          placeholder="Target (e.g., Increase 7-day return rate for newly onboarded users)"
          value={value.target}
          onChange={(e) => update("target", e.target.value)}
          className={isInline ? inlineInputClassName : undefined}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor={`${idBase}-theory`} className="text-sm font-semibold">
          Why this might work
        </Label>
        <Textarea
          id={`${idBase}-theory`}
          placeholder="If we use stated interests to recommend communities, posts, email content, and follow-up prompts, users will find relevant content faster and return more often."
          value={value.theoryOfSuccess ?? ""}
          onChange={(e) => update("theoryOfSuccess", e.target.value)}
          rows={3}
          className={isInline ? inlineBodyClassName : undefined}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor={`${idBase}-metric`} className="text-sm font-semibold">
          Primary metric
        </Label>
        <Select value={String(value.metric)} onValueChange={(next) => update("metric", next)}>
          <SelectTrigger id={`${idBase}-metric`} className="w-full" aria-label="Primary metric">
            <SelectValue placeholder="Primary metric" />
          </SelectTrigger>
          <SelectContent>
            {growthMetricOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <Label htmlFor={`${idBase}-stage`} className="text-sm font-semibold">
          When this matters
        </Label>
        <Select value={value.stage} onValueChange={(next) => update("stage", next)}>
          <SelectTrigger id={`${idBase}-stage`} className="w-full" aria-label="When this matters">
            <SelectValue placeholder="When this matters" />
          </SelectTrigger>
          <SelectContent>
            {growthStageOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <DesignOpsMultiSelect
        id={`${idBase}-segments`}
        label="Segments"
        description="Which creator or community segments should this objective apply to?"
        placeholder="Choose one or more segments"
        placeholderClassName="text-lg"
        options={designOpsSegments.map((segment) => ({
          value: segment.id,
          label: segment.name,
          description: segment.description,
        }))}
        selectedValues={value.segmentIds}
        onToggle={toggleSegment}
      />
      <DesignOpsMultiSelect
        id={`${idBase}-cohorts`}
        label="Lifecycle cohorts"
        description="Which in-product user behaviors matter most for this objective?"
        placeholder="Choose one or more cohorts"
        placeholderClassName="text-lg"
        options={lifecycleCohortOptions.map((cohort) => ({
          value: cohort.value,
          label: cohort.label,
          description: cohort.description,
        }))}
        selectedValues={value.lifecycleCohorts}
        onToggle={toggleLifecycleCohort}
      />

      <Button
        type="button"
        size="sm"
        variant="ghost"
        className="w-fit px-0 text-xs text-muted-foreground"
        onClick={() => onShowAdvancedChange(!showAdvanced)}
      >
        {showAdvanced ? "Hide more context" : "More context"}
      </Button>

      {showAdvanced && (
        <div className="space-y-3 rounded-xl border border-border/60 bg-secondary/20 p-4">
          <div className="space-y-1">
            <Label htmlFor={`${idBase}-type`} className="text-sm font-semibold">
              Objective type
            </Label>
            <Select value={value.type} onValueChange={(next) => update("type", next)}>
              <SelectTrigger id={`${idBase}-type`} className="w-full" aria-label="Objective type">
                <SelectValue placeholder="Objective type" />
              </SelectTrigger>
              <SelectContent>
                {objectiveTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label htmlFor={`${idBase}-owner`} className="text-sm font-semibold">
              Owner
            </Label>
            <Input
              id={`${idBase}-owner`}
              placeholder="Owner (e.g., Product, Miguel, Growth)"
              value={value.owner ?? ""}
              onChange={(e) => update("owner", e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
