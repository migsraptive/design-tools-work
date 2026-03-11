import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = "/Users/miguelarias/cafemedia/design/carrier";

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

test("creator tools overview page delegates major sections to dedicated components", () => {
  const page = read("app/drops/creator-tools/page.tsx");
  const header = read("components/design/creator-tools-overview-header.tsx");
  const signal = read("components/design/creator-tools-overview-signal.tsx");
  const analytics = read("components/design/creator-tools-overview-analytics.tsx");
  const kpi = read("components/design/creator-tools-kpi-card.tsx");
  const confidence = read("components/design/creator-tools-confidence-badge.tsx");

  assert.match(page, /from "@\/components\/design\/creator-tools-overview-header"/);
  assert.match(page, /from "@\/components\/design\/creator-tools-overview-signal"/);
  assert.match(page, /from "@\/components\/design\/creator-tools-overview-analytics"/);
  assert.match(page, /<CreatorToolsOverviewHeader/);
  assert.match(page, /<CreatorToolsOverviewSignal/);
  assert.match(page, /<CreatorToolsOverviewAnalytics/);
  assert.doesNotMatch(page, /^function KpiCard/m);
  assert.doesNotMatch(page, /^function ConfidenceBadge/m);
  assert.match(header, /export function CreatorToolsOverviewHeader/);
  assert.match(signal, /export function CreatorToolsOverviewSignal/);
  assert.match(analytics, /export function CreatorToolsOverviewAnalytics/);
  assert.match(kpi, /export function CreatorToolsKpiCard/);
  assert.match(confidence, /export function CreatorToolsConfidenceBadge/);
});
