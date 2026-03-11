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

  assert.match(client, /<section className="space-y-6">/);
  assert.match(client, /className="max-w-4xl"/);
  assert.doesNotMatch(client, /lg:grid-cols-\[280px_1fr\]/);
  assert.match(objectives, /objectives.length <= 1/);
  assert.match(objectives, /"grid grid-cols-1"/);
  assert.match(objectives, /"grid gap-4 md:grid-cols-2 xl:grid-cols-3"/);
  assert.doesNotMatch(objectives, /border-dashed max-w-4xl/);
});
