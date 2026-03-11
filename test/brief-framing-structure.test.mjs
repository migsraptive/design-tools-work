import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = "/Users/miguelarias/cafemedia/design/carrier";

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

test("creator tools PRD page uses tabs and includes the PRD framing rule", () => {
  const page = read("app/drops/creator-tools/prd/page.tsx");
  const component = read("components/design/brief-framing-sequence.tsx");
  const artifact = read("components/design/brief-artifact.tsx");

  assert.match(page, /Tabs,\s*TabsContent,\s*TabsList,\s*TabsTrigger/);
  assert.match(page, /PRD \/ Brief/);
  assert.match(page, /Design Plan/);
  assert.match(page, /Research/);
  assert.match(page, /BriefFramingSequence/);
  assert.match(page, /BriefArtifact/);
  assert.match(page, /creatorToolsBriefFields/);
  assert.doesNotMatch(page, /max-w-3xl text-sm leading-7 text-muted-foreground/);
  assert.match(artifact, /Conversation artifact/);
  assert.match(artifact, /Goal/);
  assert.match(artifact, /Problem \/ Opportunity/);
  assert.match(artifact, /Proposed Solution/);
  assert.match(artifact, /Expected Outcome/);
  assert.match(component, /Goal -&gt; problem\/opportunity -&gt; proposed solution -&gt; expected outcome/i);
});

test("session brief includes the shared framing rule", () => {
  const brief = read("components/design/session-brief.tsx");
  const component = read("components/design/brief-framing-sequence.tsx");

  assert.match(brief, /BriefFramingSequence/);
  assert.match(component, /Goal/);
  assert.match(component, /Problem \/ Opportunity/);
  assert.match(component, /Proposed Solution/);
  assert.match(component, /Expected Outcome/);
});

test("session creation surfaces mention the same framing order", () => {
  const page = read("app/new/page.tsx");
  const dialog = read("components/design/create-session-dialog.tsx");
  const inputs = read("components/design/session-brief-inputs.tsx");

  assert.match(page, /SessionBriefInputs/);
  assert.match(dialog, /SessionBriefInputs/);
  assert.match(inputs, /BriefFramingSequence/);
  assert.match(page, /Proposed solution or concept summary for voters/i);
  assert.match(dialog, /Proposed solution or concept summary for voters/i);
});
