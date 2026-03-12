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
  assert.match(route, /mode: mode \|\| "quick_read"/);
  assert.match(route, /archives\.unshift\(newArchive\);/);
  assert.match(route, /export async function DELETE/);
  assert.match(route, /const id = searchParams\.get\("id"\)/);
  assert.match(route, /await writeArchives\(filtered\);/);
  assert.match(types, /export interface DesignOpsArchive/);
  assert.match(types, /mode: SynthesisMode;/);
});

test("design ops client archives completed runs and renders a findings archive", () => {
  const client = read("components/design/design-ops-client.tsx");
  const archiveList = read("components/design/design-ops-archive-list.tsx");
  const workspaceHook = read("hooks/use-design-ops-workspace.ts");

  assert.match(client, /useDesignOpsWorkspace/);
  assert.match(client, /onRunComplete=\{archiveRun\}/);
  assert.match(client, /<DesignOpsArchiveList archives=\{archives\} onDelete=\{deleteArchive\} \/>/);
  assert.match(workspaceHook, /fetch\("\/api\/design-ops\/archives"\)/);
  assert.match(workspaceHook, /pendingObjectiveDeletes/);
  assert.match(workspaceHook, /pendingArchiveDeletes/);
  assert.match(workspaceHook, /toast\("Objective removed"/);
  assert.match(workspaceHook, /toast\("Synthesis removed"/);
  assert.match(workspaceHook, /label: "Undo"/);
  assert.match(archiveList, /Findings Archive/);
  assert.match(archiveList, /useState<string \| null>\(null\)/);
  assert.match(archiveList, /Archived findings/);
  assert.match(archiveList, /formatModeLabel/);
  assert.match(archiveList, /Trash2/);
  assert.match(archiveList, /onDelete\(archive\.id\)/);
  assert.doesNotMatch(archiveList, /Saved synthesis/);
  assert.match(archiveList, /without rerunning Atlas and Beacon/);
});

test("design ops timeline uses labeled token-scale sections for synthesis output", () => {
  const timeline = read("components/design/design-ops-timeline.tsx");
  const formatting = read("lib/design-ops-formatting.ts");

  assert.match(formatting, /export function formatPlainTextSections/);
  assert.match(formatting, /FINDINGS|RECOMMENDATIONS|ASSUMPTIONS|SUBJECT/);
  assert.match(formatting, /"Summary"/);
  assert.match(formatting, /"Details"/);
  assert.match(timeline, /function isProcessMessage/);
  assert.match(timeline, /formatPlainTextSections\(msg\.body\)/);
  assert.match(timeline, /Process details/);
  assert.match(timeline, /Analyzing objective/);
  assert.match(timeline, /synthesisMessages\.length === 0/);
  assert.match(timeline, /Assumptions/);
  assert.match(timeline, /text-\[10px\] font-semibold uppercase tracking-\[0\.16em\] text-muted-foreground/);
  assert.match(timeline, /text-sm leading-6 text-foreground\/85/);
});
