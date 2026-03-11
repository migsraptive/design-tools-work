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
- `OPENAI_API_KEY`
- `OPENAI_API_BASE`
- `OPENAI_SYNTHESIS_MODEL`
- `CREW_API_URL`

Client-side reads use `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
Server-side API routes use `SUPABASE_SERVICE_ROLE_KEY` for writes and privileged reads.
Session creator admin paths also rely on `DESIGN_TOOLS_PASSWORD`.
Research synthesis routes use the shared synthesis provider config.

### OpenAI Synthesis + Crew

Carrier uses OpenAI-backed synthesis and Design Ops crew runs.

Recommended defaults:

- `OPENAI_API_KEY=...`
- `OPENAI_API_BASE=https://api.openai.com/v1`
- `OPENAI_SYNTHESIS_MODEL=gpt-5.1-chat-latest`

For the Crew service in `crew/.env`:

- `OPENAI_API_KEY=...`
- `OPENAI_CREW_MODEL=gpt-5.1-codex-mini`
- `CREW_API_URL=http://127.0.0.1:8000`

This keeps the current Design Ops flow intact while swapping the underlying models:

- synthesis routes -> ChatGPT-style model
- crew agents -> Codex-style model

Carrier is intentionally OpenAI-only here so research synthesis and Design Ops runs use the same provider path.

## Backend Decision

Carrier stays on the existing Supabase project for now. The goal is to keep the current prototype stable and avoid a premature backend migration while feature work is still moving quickly.

If ownership or access needs change later, migrate intentionally with the schema in `supabase/migrations` rather than switching credentials ad hoc.

## Backend Notes

See [docs/supabase-setup.md](/Users/miguelarias/cafemedia/design/carrier/docs/supabase-setup.md) for:

- Supabase-backed feature inventory
- migration/source-of-truth notes
- future migration guidance for a work-owned project
