import asyncio
import json
import os
import re
import uuid
from datetime import datetime

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from sse_starlette.sse import EventSourceResponse

load_dotenv()

app = FastAPI(title="Design Ops Crew API")


def plain_text(value: str) -> str:
    result = re.sub(r"^#{1,6}\s+", "", value, flags=re.MULTILINE)
    result = re.sub(r"^\s*[-*+]\s+", "", result, flags=re.MULTILINE)
    result = re.sub(r"^\s*\d+\.\s+", "", result, flags=re.MULTILINE)
    result = re.sub(r"\*\*(.*?)\*\*", r"\1", result)
    result = re.sub(r"\*(.*?)\*", r"\1", result)
    result = re.sub(r"`([^`]+)`", r"\1", result)
    result = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", result)
    result = re.sub(r"\n{3,}", "\n\n", result)
    return result.strip()


@app.get("/health")
async def health():
    """Check service health and configured provider."""
    provider = os.environ.get("CREW_MODEL_PROVIDER", "openai")

    if provider == "anthropic":
        provider_status = "configured" if os.environ.get("ANTHROPIC_API_KEY") else "missing_api_key"
        configured_model = os.environ.get("ANTHROPIC_CREW_MODEL", "claude-sonnet-4-5-20250929")
    else:
        provider_status = "configured" if os.environ.get("OPENAI_API_KEY") else "missing_api_key"
        configured_model = os.environ.get("OPENAI_CREW_MODEL", "gpt-5.1-codex-mini")

    return {
        "status": "ok",
        "provider": provider,
        "provider_status": provider_status,
        "models": [configured_model],
        "configured_model": configured_model,
    }


@app.post("/run")
async def run_crew(request: Request):
    """Run the Design Ops crew and stream results via SSE."""
    body = await request.json()
    prompt = body.get("prompt", "")
    objectives = body.get("objectives", [])

    if not prompt:
        return JSONResponse(
            {"error": "prompt is required"},
            status_code=400,
        )

    run_id = str(uuid.uuid4())

    async def event_stream():
        # Send run start event
        yield {
            "event": "run_start",
            "data": json.dumps({
                "run_id": run_id,
                "started_at": datetime.now().isoformat(),
                "prompt": prompt,
            }),
        }

        # Send Oracle thinking event
        yield {
            "event": "agent_start",
            "data": json.dumps({
                "agent": "ORACLE",
                "agent_id": "design_ops_manager",
                "agent_name": "Atlas",
                "status": "thinking",
            }),
        }

        # Run the crew in a thread to avoid blocking
        try:
            from crew import run_crew as _run_crew

            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(None, _run_crew, prompt, objectives)

            # Parse the result into agent messages
            # CrewAI returns the final output as a string
            # We'll structure it as agent messages

            # Oracle's brief message
            yield {
                "event": "agent_message",
                "data": json.dumps({
                    "from": "design_ops_manager",
                    "from_name": "Atlas",
                    "to": "research_synthesizer",
                    "subject": f"Research brief: {prompt[:80]}",
                    "priority": "standard",
                    "confidence": "n/a",
                    "assumptions": "Based on available evidence in the database. Scoped to last 30 days.",
                    "body": f"Directing Meridian to analyze: {prompt}",
                    "next_step": "Meridian to pull evidence and synthesize",
                    "timestamp": datetime.now().isoformat(),
                }),
            }

            # Meridian's synthesis message (the actual crew output)
            yield {
                "event": "agent_message",
                "data": json.dumps({
                    "from": "research_synthesizer",
                    "from_name": "Beacon",
                    "to": "design_ops_manager",
                    "subject": f"Synthesis: {prompt[:60]}",
                    "priority": "standard",
                    "confidence": "medium",
                    "assumptions": "Analysis based on available observations and session data.",
                    "body": plain_text(result),
                    "next_step": "Review findings and consider prototyping recommendations.",
                    "timestamp": datetime.now().isoformat(),
                }),
            }

            # Oracle's final summary
            yield {
                "event": "agent_message",
                "data": json.dumps({
                    "from": "design_ops_manager",
                    "from_name": "Atlas",
                    "to": "user",
                    "subject": "Synthesis complete — review recommendations",
                    "priority": "standard",
                    "confidence": "medium",
                    "assumptions": "Recommendations are directional. Validate with additional research before committing.",
                    "body": (
                        "Meridian has completed the synthesis. Review the findings above and note "
                        "the confidence levels on each pattern. Recommendations with High confidence "
                        "can be acted on. Medium and Low confidence findings should be validated with "
                        "additional evidence before committing resources."
                    ),
                    "next_step": "Prioritize high-confidence recommendations for prototyping.",
                    "timestamp": datetime.now().isoformat(),
                }),
            }

            # Send completion event
            yield {
                "event": "run_complete",
                "data": json.dumps({
                    "run_id": run_id,
                    "completed_at": datetime.now().isoformat(),
                    "status": "completed",
                }),
            }

        except Exception as e:
            yield {
                "event": "error",
                "data": json.dumps({
                    "run_id": run_id,
                    "error": str(e),
                    "timestamp": datetime.now().isoformat(),
                }),
            }

    return EventSourceResponse(event_stream())


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
