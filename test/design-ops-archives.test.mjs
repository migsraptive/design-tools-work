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

test("design ops timeline uses labeled token-scale sections for synthesis output", () => {
  const timeline = read("components/design/design-ops-timeline.tsx");
  const formatting = read("lib/design-ops-formatting.ts");

  assert.match(formatting, /export function formatPlainTextSections/);
  assert.match(formatting, /FINDINGS|RECOMMENDATIONS|ASSUMPTIONS|SUBJECT/);
  assert.match(formatting, /"Summary"/);
  assert.match(formatting, /"Details"/);
  assert.match(timeline, /formatPlainTextSections\(msg\.body\)/);
  assert.match(timeline, /!isExpanded &&/);
  assert.match(timeline, /Assumptions/);
  assert.match(timeline, /text-\[10px\] font-semibold uppercase tracking-\[0\.16em\] text-muted-foreground/);
  assert.match(timeline, /text-xs leading-5 text-foreground\/85/);
});
