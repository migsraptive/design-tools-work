"use client";

import { DesignOpsStepNav } from "@/components/design/design-ops-step-nav";
import { DesignOpsObjectives } from "@/components/design/design-ops-objectives";
import { DesignOpsCrewRunner } from "@/components/design/design-ops-crew-runner";
import { DesignOpsTimeline } from "@/components/design/design-ops-timeline";
import { DesignOpsArchiveList } from "@/components/design/design-ops-archive-list";
import { Button } from "@/components/ui/button";
import { useDesignOpsWorkspace } from "@/hooks/use-design-ops-workspace";

export function DesignOpsClient() {
  const {
    objectives,
    activeObjectiveId,
    activeObjective,
    messages,
    archives,
    running,
    loading,
    activeStep,
    canOpenSynthesis,
    canOpenFindings,
    setActiveObjectiveId,
    setMessages,
    setRunning,
    setActiveStep,
    addObjective,
    updateObjective,
    deleteObjective,
    deleteArchive,
    archiveRun,
  } = useDesignOpsWorkspace();

  if (loading) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Loading Design Ops...
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Design Ops</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          AI-powered research synthesis tied to one active business objective at a time.
        </p>
      </div>

      <DesignOpsStepNav
        activeStep={activeStep}
        canOpenSynthesis={canOpenSynthesis}
        canOpenFindings={canOpenFindings}
        onStepChange={setActiveStep}
      />

      {activeStep === "objective" ? (
        <section className="space-y-6">
          <DesignOpsObjectives
            objectives={objectives}
            activeObjectiveId={activeObjectiveId}
            onActiveObjectiveChange={setActiveObjectiveId}
            onAdd={addObjective}
            onUpdate={updateObjective}
            onDelete={deleteObjective}
          />

          <div className="flex justify-end">
            <Button
              type="button"
              onClick={() => setActiveStep("synthesis")}
              disabled={!canOpenSynthesis}
            >
              Continue to Synthesis
            </Button>
          </div>
        </section>
      ) : null}

      {activeStep === "synthesis" ? (
        <section className="space-y-6">
          <DesignOpsCrewRunner
            objective={activeObjective}
            onMessages={setMessages}
            onRunStatusChange={setRunning}
            onRunComplete={archiveRun}
          />

          <div className="flex justify-between">
            <Button type="button" variant="ghost" onClick={() => setActiveStep("objective")}>
              Back to Objective
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setActiveStep("findings")}
              disabled={!canOpenFindings}
            >
              View Findings
            </Button>
          </div>
        </section>
      ) : null}

      {activeStep === "findings" ? (
        <section className="space-y-6">
          {(messages.length > 0 || running) && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {running ? "Live synthesis" : "Current findings"}
              </h3>
              <DesignOpsTimeline messages={messages} />
            </div>
          )}

          <DesignOpsArchiveList archives={archives} onDelete={deleteArchive} />

          <div className="flex justify-between">
            <Button type="button" variant="ghost" onClick={() => setActiveStep("synthesis")}>
              Back to Synthesis
            </Button>
            <Button type="button" variant="outline" onClick={() => setActiveStep("objective")}>
              Edit Objective
            </Button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
