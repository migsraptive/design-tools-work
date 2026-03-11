import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = "/Users/miguelarias/cafemedia/design/carrier";

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

test("design ops archives route persists completed findings locally", () => {
  const route = read("app/api/design-ops/archives/route.ts");
  const types = read("lib/design-ops-types.ts");

  assert.match(route, /design-ops-archives\.json/);
  assert.match(route, /await fs\.mkdir\(FILE_DIR, \{ recursive: true \}\);/);
  assert.match(route, /if \(!prompt \|\| !Array\.isArray\(messages\) \|\| messages\.length === 0\)/);
  assert.match(route, /archives\.unshift\(newArchive\);/);
  assert.match(types, /export interface DesignOpsArchive/);
});

test("design ops client archives completed runs and renders a findings archive", () => {
  const client = read("components/design/design-ops-client.tsx");
  const archiveList = read("components/design/design-ops-archive-list.tsx");

  assert.match(client, /fetch\("\/api\/design-ops\/archives"\)/);
  assert.match(client, /onRunComplete=\{handleArchiveRun\}/);
  assert.match(client, /<DesignOpsArchiveList archives=\{archives\} \/>/);
  assert.match(archiveList, /Findings Archive/);
  assert.match(archiveList, /Archived findings/);
  assert.match(archiveList, /without rerunning Atlas and Beacon/);
});

test("design ops timeline uses stronger typography hierarchy for synthesis output", () => {
  const timeline = read("components/design/design-ops-timeline.tsx");

  assert.match(timeline, /text-lg font-black tracking-tight/);
  assert.match(timeline, /text-\[15px\] leading-7/);
  assert.match(timeline, /Recommended next step/);
  assert.match(timeline, /tracking-\[0\.16em\]/);
});
