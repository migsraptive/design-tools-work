import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = "/Users/miguelarias/cafemedia/design/carrier";

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

test("design ops health route mirrors provider-based crew health", () => {
  const route = read("app/api/design-ops/health/route.ts");
  const runRoute = read("app/api/design-ops/run/route.ts");
  const types = read("lib/design-ops-types.ts");

  assert.match(route, /127\.0\.0\.1:8000/);
  assert.match(runRoute, /127\.0\.0\.1:8000/);
  assert.match(route, /provider: data\.provider/);
  assert.match(route, /providerStatus: data\.provider_status/);
  assert.match(route, /configuredModel: data\.configured_model/);
  assert.doesNotMatch(route, /ollama: data\.ollama/);
  assert.match(types, /provider\?: string;/);
  assert.match(types, /providerStatus\?: string;/);
});

test("design ops runner renders selectable objectives as wrapped stacked content", () => {
  const runner = read("components/design/design-ops-crew-runner.tsx");

  assert.match(runner, /providerName = health\?\.provider === "openai" \? "OpenAI" : "model provider"/);
  assert.match(runner, /className="flex items-start gap-3 rounded-lg/);
  assert.match(runner, /className="mt-1 rounded shrink-0"/);
  assert.match(runner, /<div className="min-w-0 space-y-1">/);
  assert.match(runner, /Target:<\/span>/);
  assert.match(runner, /currentEvent === "run_start"/);
  assert.match(runner, /subject: "Crew run started"/);
  assert.match(runner, /currentEvent === "agent_start"/);
  assert.match(runner, /\? "Atlas"/);
  assert.match(runner, /\? "Beacon"/);
  assert.match(runner, /subject: `\$\{agentName\} is working`/);
  assert.match(runner, /split\(\/\\r\?\\n\\r\?\\n\/\)/);
  assert.match(runner, /if \(buffer\.trim\(\)\)/);
  assert.match(runner, /consumeEventChunk/);
  assert.match(runner, /if \(currentEvent === "error"\)/);
  assert.match(runner, /throw new Error\(streamError\);/);
  assert.match(runner, /disabled=\{running \|\| !prompt\.trim\(\)\}/);
  assert.doesNotMatch(runner, /crewUnavailable/);
  assert.doesNotMatch(runner, /Ollama not running/);
  assert.doesNotMatch(runner, /Ollama/);
  assert.doesNotMatch(runner, /\{obj\.title\}: \{obj\.metric\} → \{obj\.target\}/);
});
