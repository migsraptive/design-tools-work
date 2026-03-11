# Carrier

Carrier is a private product-design workspace for exploration sessions, research synthesis, replay review, and project drops.

## Local Development

Use the canonical repo path:

```bash
cd /Users/miguelarias/cafemedia/design/carrier
npm run dev
```

Carrier runs at:

- `http://localhost:3500`
- `http://localhost:3500/drops/creator-tools`
- `http://localhost:3500/seed`

## Environment Setup

Copy `.env.example` into your local env file and provide:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DESIGN_TOOLS_PASSWORD`
- `SYNTHESIS_PROVIDER`
- `OPENAI_API_KEY`
- `OPENAI_API_BASE`
- `OPENAI_SYNTHESIS_MODEL`
- `CREW_API_URL`
- `OLLAMA_BASE_URL`
- `OLLAMA_MODEL`

Client-side reads use `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
Server-side API routes use `SUPABASE_SERVICE_ROLE_KEY` for writes and privileged reads.
Session creator admin paths also rely on `DESIGN_TOOLS_PASSWORD`.
Research synthesis routes use the shared synthesis provider config.

### OpenAI Synthesis + Crew

Carrier now supports OpenAI-backed synthesis and Design Ops crew runs.

Recommended defaults:

- `SYNTHESIS_PROVIDER=openai`
- `OPENAI_API_KEY=...`
- `OPENAI_API_BASE=https://api.openai.com/v1`
- `OPENAI_SYNTHESIS_MODEL=gpt-5.1-chat-latest`

For the Crew service in `crew/.env`:

- `CREW_MODEL_PROVIDER=openai`
- `OPENAI_API_KEY=...`
- `OPENAI_CREW_MODEL=gpt-5.1-codex-mini`
- `CREW_API_URL=http://127.0.0.1:8000`

This keeps the current Design Ops flow intact while swapping the underlying models:

- synthesis routes -> ChatGPT-style model
- crew agents -> Codex-style model

### Ollama Fallback

Carrier still supports a local Ollama fallback through [synthesis-llm.ts](/Users/miguelarias/cafemedia/design/carrier/lib/synthesis-llm.ts) and the Crew provider config.

Recommended local defaults:

- `OLLAMA_BASE_URL=http://localhost:11434`
- `OLLAMA_MODEL=qwen2.5:7b`

If you want to use Ollama again later:

- set `SYNTHESIS_PROVIDER=ollama`
- set `CREW_MODEL_PROVIDER=ollama`
- keep `OLLAMA_BASE_URL` and `OLLAMA_MODEL` configured

## Backend Decision

Carrier stays on the existing Supabase project for now. The goal is to keep the current prototype stable and avoid a premature backend migration while feature work is still moving quickly.

If ownership or access needs change later, migrate intentionally with the schema in `supabase/migrations` rather than switching credentials ad hoc.

## Backend Notes

See [docs/supabase-setup.md](/Users/miguelarias/cafemedia/design/carrier/docs/supabase-setup.md) for:

- Supabase-backed feature inventory
- migration/source-of-truth notes
- future migration guidance for a work-owned project
