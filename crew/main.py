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


def extract_section(value: str, label: str) -> str:
    pattern = re.compile(
        rf"^{re.escape(label)}:\s*(.*?)(?=^\s*[A-Z][A-Z\s]+:\s|\Z)",
        re.MULTILINE | re.DOTALL,
    )
    match = pattern.search(value)
    return plain_text(match.group(1)) if match else ""


def extract_confidence(value: str) -> str:
    match = re.search(r"^CONFIDENCE:\s*(high|medium|low|n/a)", value, re.MULTILINE | re.IGNORECASE)
    return match.group(1).lower() if match else "medium"


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
    mode = body.get("mode", "quick_read")
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
                "mode": mode,
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
            result = await loop.run_in_executor(None, _run_crew, prompt, objectives, mode)
            result_text = plain_text(result)
            beacon_subject = extract_section(result, "SUBJECT") or f"Synthesis: {prompt[:60]}"
            beacon_confidence = extract_confidence(result)
            beacon_assumptions = (
                extract_section(result, "ASSUMPTIONS")
                or "Analysis based on available observations and session data."
            )
            beacon_next_step = (
                extract_section(result, "NEXT STEPS")
                or extract_section(result, "NEXT STEP")
                or "Review findings and consider prototyping recommendations."
            )
            beacon_readiness = extract_section(result, "READINESS")
            beacon_additional_signals = (
                extract_section(result, "ADDITIONAL SIGNALS WORTH GATHERING")
                or extract_section(result, "WHAT WOULD IMPROVE CONFIDENCE")
            )

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
                    "assumptions": "Based on available evidence in the workspace and the objectives selected for this run.",
                    "body": (
                        f"Directing Beacon to analyze: {prompt}\n\n"
                        f"MODE: {mode.replace('_', ' ')}\n\n"
                        f"READINESS: Atlas has framed the brief and scoped the evidence request.\n\n"
                        f"WHAT WOULD IMPROVE CONFIDENCE: If the evidence is thin, Beacon should surface the next 1-3 signals worth gathering."
                    ),
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
                    "subject": beacon_subject,
                    "priority": "standard",
                    "confidence": beacon_confidence,
                    "assumptions": beacon_assumptions,
                    "body": result_text,
                    "next_step": beacon_next_step,
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
                    "confidence": beacon_confidence,
                    "assumptions": (
                        "Recommendations are directional and should be weighed against the available evidence "
                        "and any assumptions surfaced in the synthesis."
                    ),
                    "body": (
                        "Beacon has completed the synthesis.\n\n"
                        f"READINESS: {beacon_readiness or 'Use the confidence and assumptions sections to judge whether the evidence is strong enough to act on now.'}\n\n"
                        f"WHAT WOULD IMPROVE CONFIDENCE: {beacon_additional_signals or 'Use the additional signals section in the synthesis to identify the next best evidence to gather.'}"
                    ),
                    "next_step": beacon_next_step,
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
