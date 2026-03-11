from crewai import Crew, Process, LLM

from agents import create_oracle, create_meridian
from tasks import create_frame_brief_task, create_synthesize_task
from tools import fetch_evidence


def get_llm() -> LLM:
    import os
    provider = os.environ.get("CREW_MODEL_PROVIDER", "openai")

    if provider == "anthropic":
        model = os.environ.get("ANTHROPIC_CREW_MODEL", "claude-sonnet-4-5-20250929")
        return LLM(
            model=f"anthropic/{model}",
            api_key=os.environ.get("ANTHROPIC_API_KEY"),
            max_tokens=4096,
        )

    model = os.environ.get("OPENAI_CREW_MODEL", "gpt-5.1-codex-mini")
    kwargs = {
        "model": f"openai/{model}",
        "api_key": os.environ.get("OPENAI_API_KEY"),
    }
    base_url = os.environ.get("OPENAI_API_BASE")
    if base_url:
        kwargs["base_url"] = base_url
    return LLM(**kwargs)


def run_crew(prompt: str, objectives: list[dict]) -> str:
    llm = get_llm()
    evidence_topic = prompt[:160]
    try:
        evidence_text = fetch_evidence.run(topic=evidence_topic, days=30)
    except Exception as error:
        evidence_text = (
            "Evidence fetch failed. Treat the data as thin and state assumptions explicitly.\n"
            f"Fetch error: {error}"
        )

    oracle = create_oracle(llm)
    meridian = create_meridian(llm)

    brief_task = create_frame_brief_task(oracle, prompt, objectives)
    synth_task = create_synthesize_task(meridian, prompt, objectives, evidence_text)

    crew = Crew(
        agents=[oracle, meridian],
        tasks=[brief_task, synth_task],
        process=Process.sequential,
        verbose=True,
    )

    result = crew.kickoff()
    return str(result)


if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv()

    result = run_crew(
        prompt="What patterns are emerging from recent user research?",
        objectives=[
            {
                "title": "Improve activation",
                "metric": "Activation rate",
                "target": "50%",
                "description": "Increase new user activation from 40% to 50%",
            }
        ],
    )
    print("\n=== CREW RESULT ===")
    print(result)
