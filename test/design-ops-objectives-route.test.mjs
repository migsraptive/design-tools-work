import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = "/Users/miguelarias/cafemedia/design/carrier";

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

test("design ops objectives route creates its storage directory before writing", () => {
  const route = read("app/api/design-ops/objectives/route.ts");
  const types = read("lib/design-ops-types.ts");
  const objectives = read("components/design/design-ops-objectives.tsx");
  const fields = read("components/design/design-ops-objective-fields.tsx");

  assert.match(route, /const FILE_DIR = path\.dirname\(FILE_PATH\);/);
  assert.match(route, /await fs\.mkdir\(FILE_DIR, \{ recursive: true \}\);/);
  assert.match(route, /await fs\.writeFile\(FILE_PATH, JSON\.stringify\(objectives, null, 2\)\);/);
  assert.match(route, /type: type \|\| "product"/);
  assert.match(route, /stage: stage \|\| "q2_learn"/);
  assert.match(route, /segmentIds: Array\.isArray\(segmentIds\) \? segmentIds : \[\]/);
  assert.match(route, /lifecycleCohorts: Array\.isArray\(lifecycleCohorts\) \? lifecycleCohorts : \[\]/);
  assert.match(route, /export async function PATCH/);
  assert.match(route, /const updated: Objective =/);
  assert.match(types, /export type ObjectiveType/);
  assert.match(types, /export type GrowthStage/);
  assert.match(types, /export type LifecycleCohort/);
  assert.match(types, /export interface Segment/);
  assert.match(objectives, /DesignOpsObjectiveFields/);
  assert.match(objectives, /activeObjectiveId/);
  assert.match(objectives, /Current objective/);
  assert.match(objectives, /Previous objectives/);
  assert.match(objectives, /onUpdate/);
  assert.match(objectives, /Save objective/);
  assert.match(objectives, /Create objective/);
  assert.match(fields, /objectiveTypeOptions/);
  assert.match(fields, /growthStageOptions/);
  assert.match(fields, /lifecycleCohortOptions/);
  assert.match(fields, /Why this might work/);
  assert.match(fields, /More context/);
});
