from crewai import Task, Agent


def create_frame_brief_task(
    agent: Agent,
    prompt: str,
    objectives: list[dict],
    mode_guidance: str,
) -> Task:
    objectives_text = "\n".join(
        f"- {obj.get('title', '')}\n"
        f"  Type: {obj.get('type', 'product')}\n"
        f"  Stage: {obj.get('stage', 'q2_learn')}\n"
        f"  Metric: {obj.get('metric', '')}\n"
        f"  Target: {obj.get('target', '')}\n"
        f"  Segments: {', '.join(obj.get('segmentIds', [])) or 'none specified'}\n"
        f"  Lifecycle cohorts: {', '.join(obj.get('lifecycleCohorts', [])) or 'none specified'}\n"
        f"  Theory of success: {obj.get('theoryOfSuccess', '')}\n"
        f"  Owner: {obj.get('owner', '')}\n"
        f"  Notes: {obj.get('description', '')}"
        for obj in objectives
    ) or "No specific objectives defined."

    return Task(
        description=(
            f"You are Atlas, the Design Lead. A user has requested a design ops synthesis.\n\n"
            f"USER PROMPT: {prompt}\n\n"
            f"BUSINESS OBJECTIVES:\n{objectives_text}\n\n"
            f"{mode_guidance}\n"
            f"Your job:\n"
            f"1. Reframe the user's prompt into a clear research brief\n"
            f"2. Connect it to the business objectives above\n"
            f"3. Explicitly identify which segment or segment hypothesis this run applies to\n"
            f"4. Explicitly identify which lifecycle cohort this run applies to when relevant\n"
            f"5. Explicitly identify which growth stage this run supports\n"
            f"6. Frame the brief with: Objective → What we have → What we're assuming → Desired output\n"
            f"7. Direct Beacon (the research analyst) to pull evidence and produce a synthesis\n"
            f"8. Be specific about what evidence to look for and how to scope the analysis\n\n"
            f"Output rules:\n"
            f"- Make progress even with partial information\n"
            f"- Do not block the run because some inputs are missing\n"
            f"- If the data is thin, explicitly say what additional signals would improve confidence\n"
            f"- Keep the brief concise and scannable\n\n"
            f"Do NOT produce the synthesis yourself. Your job is to frame the brief clearly "
            f"so Beacon can do focused, high-quality research synthesis."
        ),
        expected_output=(
            "A structured brief that includes:\n"
            "- SUBJECT: one-line summary of the analysis focus\n"
            "- OBJECTIVE: what business goal this serves\n"
            "- SEGMENT: which segment or segment hypothesis this applies to\n"
            "- LIFECYCLE COHORT: which user-behavior cohort this applies to\n"
            "- STAGE: which growth stage this supports\n"
            "- READINESS: sufficient / partial / weak, with one sentence explaining why\n"
            "- WHAT WE HAVE: what evidence is available\n"
            "- ASSUMPTIONS: what we're taking as given\n"
            "- DESIRED OUTPUT: what Beacon should produce\n"
            "- METRIC TO MOVE: what KPI this should influence\n"
            "- SCOPE: specific areas or time ranges to focus on\n"
            "- WHAT WOULD IMPROVE CONFIDENCE: 1-3 additional signals worth gathering"
        ),
        agent=agent,
    )
