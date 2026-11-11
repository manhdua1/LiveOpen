# Project Handoff

## Approved Decisions
- Set up a TypeScript discord.js bot for Deadlock statistics; external API integration is deferred.
- Initial scope: modular slash commands, `/ping`, environment configuration, development-guild registration, and dev/build/start scripts.
- User approved runtime model names `Planning (9router-github-copilot)` and `Coding (9router-github-copilot)` in place of the IDs in AGENTS.md.

## Assumptions
- Local development uses npm and Node.js >=22.12.0.
- Only the Guilds intent is needed for the current slash-command scaffold.

## Current State
- TypeScript scaffold implemented with configuration validation, interaction error handling, and graceful shutdown.
- Dependencies installed and package-lock.json generated.
- Coordinator verified typecheck, production build, and all 16 tests on 2026-11-11.
- User requested committing the scaffold and pushing it to GitHub on the existing `dev` branch at `origin` (`manhdua1/LiveOpen`).

## Blockers
- Live Discord login and guild command registration are not verified; credentials must be entered locally, never in chat or tracked files.
- Named specialist agent manifests are absent. The Explore wrapper is read-only; implementation succeeded using the default execution-capable delegate with the approved Coding model.

## Next Actions
- User creates local `.env` from `.env.example` and sets DISCORD_TOKEN, DISCORD_CLIENT_ID, and DISCORD_GUILD_ID.
- Invite the bot with bot and applications.commands scopes, then run `npm run deploy:guild` and `npm run dev` to check `/ping` in the development server.
- Clarify Deadlock API endpoints and desired statistics before integrating the API.

## Relevant Paths & Verification
- `README.md`: setup instructions.
- `src/index.ts`, `src/client.ts`, `src/config.ts`: startup and configuration.
- `src/commands/`, `src/handlers/interaction.ts`: command registry and interaction handling.
- `src/deploy-commands.ts`: guild command deployment.
- `npm run typecheck`: passed.
- `npm run build`: passed.
- `npm test`: 16 passed, 0 failed; intentional error-path tests emit error logs.