import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = "/Users/miguelarias/cafemedia/design/carrier";

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

test("creator tools overview uses a separate product-map hub and keeps the PRD as a distinct artifact", () => {
  const page = read("app/drops/creator-tools/page.tsx");
  const map = read("components/design/creator-tools-overview-map.tsx");
  const header = read("components/design/creator-tools-overview-header.tsx");
  const mock = read("lib/mock/creator-tools.ts");

  assert.match(page, /CreatorToolsOverviewMap/);
  assert.match(map, /Product map/);
  assert.match(map, /PRD \/ Brief/);
  assert.match(map, /Supporting surfaces/);
  assert.match(map, /Open PRD \/ Brief/);
  assert.match(header, /Creator Tools hub/);
  assert.match(mock, /creatorToolsModules/);
  assert.match(mock, /creatorToolsSupportingSurfaces/);
});

test("creator tools overview uses the simplified lower layout", () => {
  const signal = read("components/design/creator-tools-overview-signal.tsx");
  const page = read("app/drops/creator-tools/page.tsx");

  assert.match(signal, /Current recommendation/);
  assert.match(signal, /Supporting proof points/);
  assert.match(signal, /headline takeaway/);
  assert.doesNotMatch(signal, /CreatorToolsKpiCard/);
  assert.doesNotMatch(page, /CreatorToolsOverviewAnalytics/);
});
