import type { Objective, SynthesisMode } from "@/lib/design-ops-types";

function compact(value: string | undefined) {
  return value?.trim().replace(/\s+/g, " ") ?? "";
}

export function buildRecommendedPrompt(objective: Objective | null) {
  if (!objective) return "";

  const title = compact(objective.title).replace(/[.?!]+$/, "");
  const target = compact(objective.target);
  const metric = compact(objective.metric);

  return [
    `What is the strongest near-term strategy for ${title.toLowerCase()}?`,
    "Compare the most likely product, lifecycle, or messaging levers and recommend what to test first.",
    metric ? `Center the recommendation on improving ${metric.replaceAll("_", " ")}.` : "",
    target ? `Keep the target in mind: ${target}.` : "",
    "Call out what additional signals would most improve confidence.",
  ]
    .filter(Boolean)
    .join(" ");
}

export function buildDeepDiveReferencePrompt(objective: Objective | null) {
  if (!objective) return "";

  const title = compact(objective.title);
  const description = compact(objective.description);
  const target = compact(objective.target);
  const theory = compact(objective.theoryOfSuccess);
  const stage = compact(objective.stage).replaceAll("_", " ");
  const metric = compact(objective.metric).replaceAll("_", " ");

  return [
    `Analyze ${title} as a ${stage} design ops question.`,
    description ? `Problem / opportunity: ${description}` : "",
    target ? `Target: ${target}.` : "",
    theory ? `Current hypothesis: ${theory}` : "",
    metric ? `Primary metric to move: ${metric}.` : "",
    "Compare the strongest candidate levers, identify the most credible near-term path, explain tradeoffs, and explicitly separate direct evidence from inference.",
    "Include readiness, assumptions, additional signals worth gathering, and what we should test before making a larger investment.",
  ]
    .filter(Boolean)
    .join(" ");
}

export function getModePromptGuidance(mode: SynthesisMode) {
  switch (mode) {
    case "quick_read":
      return "Fastest path. Keep the question tight and decision-oriented.";
    case "decision_memo":
      return "Best default. Ask for prioritization, rationale, and what to test first.";
    case "deep_dive":
      return "Slowest mode. Use when you want tradeoffs, evidence gaps, and scenario depth.";
    default:
      return "";
  }
}
