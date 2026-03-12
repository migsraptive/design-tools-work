import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = "/Users/miguelarias/cafemedia/design/carrier";

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

test("design ops layout uses stacked rows with a separate objectives section", () => {
  const client = read("components/design/design-ops-client.tsx");
  const objectives = read("components/design/design-ops-objectives.tsx");
  const growthContext = read("lib/mock/design-ops-growth-context.ts");
  const objectiveFields = read("components/design/design-ops-objective-fields.tsx");
  const multiSelect = read("components/design/design-ops-multi-select.tsx");
  const stepNav = read("components/design/design-ops-step-nav.tsx");
  const workspaceHook = read("hooks/use-design-ops-workspace.ts");

  assert.match(client, /<section className="space-y-6">/);
  assert.match(client, /className="min-w-0 space-y-6"/);
  assert.match(client, /useDesignOpsWorkspace/);
  assert.match(client, /Continue to Synthesis/);
  assert.match(client, /Current findings/);
  assert.match(client, /activeObjectiveId/);
  assert.doesNotMatch(client, /className="max-w-4xl"/);
  assert.doesNotMatch(client, /lg:grid-cols-\[280px_1fr\]/);
  assert.match(stepNav, /export type DesignOpsStep = "objective" \| "synthesis" \| "findings"/);
  assert.match(stepNav, /Objective/);
  assert.match(stepNav, /Synthesis/);
  assert.match(stepNav, /Findings/);
  assert.match(workspaceHook, /pendingObjectiveDeletes/);
  assert.match(workspaceHook, /pendingArchiveDeletes/);
  assert.match(workspaceHook, /toast\("Objective removed"/);
  assert.match(workspaceHook, /toast\("Synthesis removed"/);
  assert.match(workspaceHook, /setActiveStep\("findings"\)/);
  assert.match(objectives, /<Card className="border-dashed">/);
  assert.match(objectives, /Current objective/);
  assert.match(objectives, /Previous objectives/);
  assert.match(objectives, /Load/);
  assert.match(objectives, /activeObjectiveId/);
  assert.match(objectives, /Create objective/);
  assert.match(objectives, /Save objective/);
  assert.match(objectives, /Reset changes/);
  assert.doesNotMatch(objectives, /border-dashed max-w-4xl/);
  assert.match(objectiveFields, /Segments/);
  assert.match(objectiveFields, /Why this might work/);
  assert.match(objectiveFields, /Owner/);
  assert.match(objectiveFields, /More context/);
  assert.match(objectiveFields, /Problem \/ Opportunity/);
  assert.match(objectiveFields, /Primary metric/);
  assert.match(objectiveFields, /When this matters/);
  assert.match(objectiveFields, /Lifecycle cohorts/);
  assert.match(objectiveFields, /DesignOpsMultiSelect/);
  assert.doesNotMatch(objectiveFields, /grid gap-2 md:grid-cols-2/);
  assert.match(objectiveFields, /Choose one or more segments/);
  assert.match(objectiveFields, /Choose one or more cohorts/);
  assert.match(multiSelect, /PopoverTrigger/);
  assert.match(multiSelect, /selectedValues/);
  assert.match(multiSelect, /Check className="size-3"/);
  assert.match(growthContext, /New users/);
  assert.match(growthContext, /Regular users/);
});
