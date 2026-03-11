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

  assert.match(route, /const FILE_DIR = path\.dirname\(FILE_PATH\);/);
  assert.match(route, /await fs\.mkdir\(FILE_DIR, \{ recursive: true \}\);/);
  assert.match(route, /await fs\.writeFile\(FILE_PATH, JSON\.stringify\(objectives, null, 2\)\);/);
});
