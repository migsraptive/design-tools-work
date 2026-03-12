"use client";

import { CheckCircle2, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export type DesignOpsStep = "objective" | "synthesis" | "findings";

const STEPS: Array<{
  id: DesignOpsStep;
  label: string;
  icon: typeof FileText;
}> = [
  { id: "objective", label: "Objective", icon: FileText },
  { id: "synthesis", label: "Synthesis", icon: Sparkles },
  { id: "findings", label: "Findings", icon: CheckCircle2 },
];

interface DesignOpsStepNavProps {
  activeStep: DesignOpsStep;
  canOpenSynthesis: boolean;
  canOpenFindings: boolean;
  onStepChange: (step: DesignOpsStep) => void;
}

export function DesignOpsStepNav({
  activeStep,
  canOpenSynthesis,
  canOpenFindings,
  onStepChange,
}: DesignOpsStepNavProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {STEPS.map((step, index) => {
        const Icon = step.icon;
        const disabled =
          (step.id === "synthesis" && !canOpenSynthesis) ||
          (step.id === "findings" && !canOpenFindings);
        const active = activeStep === step.id;

        return (
          <Button
            key={step.id}
            type="button"
            variant={active ? "default" : "outline"}
            size="sm"
            disabled={disabled}
            onClick={() => onStepChange(step.id)}
            className="gap-2"
          >
            <span className="text-xs tabular-nums">{index + 1}.</span>
            <Icon className="size-4" />
            {step.label}
          </Button>
        );
      })}
    </div>
  );
}
