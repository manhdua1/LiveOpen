# LiveOpen Discord Bot

Modular TypeScript Discord bot scaffold built with [discord.js v14](https://discord.js.org/).

## Prerequisites

- Node.js `>=22.12.0`
- Discord Bot Token & Application Client ID from the [Discord Developer Portal](https://discord.com/developers/applications)
- Development Guild (Server) ID for rapid slash command registration

## Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Configure credentials in `.env`:
   ```env
   DISCORD_TOKEN=your_bot_token_here
   DISCORD_CLIENT_ID=your_application_client_id_here
   DISCORD_GUILD_ID=your_development_guild_id_here
   ```

## Available Scripts

- **`npm run dev`**: Run bot in watch mode using `tsx`.
- **`npm run build`**: Compile TypeScript to `dist/`.
- **`npm start`**: Run compiled bot from `dist/`.
- **`npm run deploy:guild`**: Register slash commands to the development guild via REST API.
- **`npm run typecheck`**: Run TypeScript compiler checks without emitting files.
- **`npm test`**: Run test suite using `tsx --test`.

## Architecture

- `src/types.ts`: Core interfaces for slash commands and bot configuration.
- `src/config.ts`: Environment loading and validation with snowflake checking and zero secret leakage.
- `src/commands/`: Modular slash command definitions (`/ping`).
- `src/handlers/interaction.ts`: Safe chat input command dispatching and ephemeral error handling.
- `src/client.ts`: Discord client setup with `GatewayIntentBits.Guilds` only and graceful shutdown handlers.
- `src/deploy-commands.ts`: Standalone deployment script targeting the development guild using Discord REST API.
- `src/index.ts`: Application bootstrap and gateway connection.
