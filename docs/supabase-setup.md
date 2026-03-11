# Carrier Supabase Setup

Carrier stays on the existing Supabase project for now.

That is intentional. The current priority is keeping the prototype stable while design/product work continues. We are not migrating to a work-owned Supabase project in this pass.

## Required Environment Variables

Carrier expects these variables locally:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DESIGN_TOOLS_PASSWORD`
- `OPENAI_API_KEY`
- `OPENAI_API_BASE`
- `OPENAI_SYNTHESIS_MODEL`

Where they are used:

- `lib/supabase.ts`
  - creates the client-side Supabase instance
- `lib/supabase-server.ts`
  - creates the server/admin Supabase client for API routes
- `app/api/design/sessions/[id]/route.ts`
  - uses `DESIGN_TOOLS_PASSWORD` for admin override flows
- related `app/api/design/**` routes
  - use the same admin client and password pattern

## What Depends on Supabase

Carrier currently uses Supabase for:

- sessions, votes, options, comments, reactions
- realtime updates for voting and session status
- research observations, segments, and synthesized research insights
- notifications and upload-related backend flows

If Supabase env vars are missing, read/write functionality will fail or degrade across those areas.

## Synthesis Provider Setup

Carrier's synthesis endpoints now call the shared provider layer in [synthesis-llm.ts](/Users/miguelarias/cafemedia/design/carrier/lib/synthesis-llm.ts).

Recommended OpenAI configuration:

- `OPENAI_API_KEY=...`
- `OPENAI_API_BASE=https://api.openai.com/v1`
- `OPENAI_SYNTHESIS_MODEL=gpt-5.1-chat-latest`

Crew service recommendation in `crew/.env`:

- `OPENAI_API_KEY=...`
- `OPENAI_CREW_MODEL=gpt-5.1-codex-mini`

Carrier and Design Ops are intentionally OpenAI-only so synthesis and Crew runs stay on one provider path.

## Schema Source of Truth

The repo-backed schema lives in:

- `supabase/migrations`
- `lib/supabase-schema.sql`

Important note:

- `lib/supabase-schema.sql` is the broad base schema snapshot
- `supabase/migrations` contains incremental changes for newer feature areas like stakeholder context, design comments, and research insights

If the live project and the repo ever drift, treat `supabase/migrations` as the operational source of truth for what should be applied next.

## Current Migration Inventory

Current repo migrations include:

- `20260302_add_stakeholder_context.sql`
- `20260302_move_effort_impact_to_votes.sql`
- `20260303_add_excalidraw_media_type.sql`
- `20260303_add_design_comments.sql`
- `20260305_add_research_insights.sql`

These cover the current Carrier areas this repo expects to exist on the backend.

## Future Migration to a Work-Owned Project

If Carrier later moves off the existing Supabase project, use this order:

1. create the new work-owned Supabase project
2. apply `lib/supabase-schema.sql` if needed for a clean base, or apply the repo migrations in order
3. verify sessions, votes, comments, research, and notifications against the new project
4. swap local env vars only after schema verification succeeds
5. migrate data separately if historical prototype data matters

Do not switch credentials first and hope the schema matches. Apply and verify the backend shape before changing the app environment.
