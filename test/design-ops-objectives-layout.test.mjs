import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = "/Users/miguelarias/cafemedia/design/carrier";

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

test("design ops objectives layout supports long metric and target content", () => {
  const component = read("components/design/design-ops-objectives.tsx");

  assert.match(component, /flex flex-col gap-2 sm:flex-row/);
  assert.match(component, /max-w-full whitespace-normal break-words text-left leading-relaxed/);
  assert.match(component, /Target:<\/span>/);
  assert.match(component, /leading-relaxed text-muted-foreground break-words/);
  assert.doesNotMatch(component, /flex items-center gap-2 mt-1/);
  assert.doesNotMatch(component, /→ \{obj\.target\}/);
});
