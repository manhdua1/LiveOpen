import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createDiscordClient, registerShutdownHandlers } from './client.js';
import { parseBotConfig } from './config.js';
import type { BotConfig } from './types.js';

export async function startBot(customConfig?: BotConfig) {
  const config = customConfig ?? parseBotConfig();

  const client = createDiscordClient();
  registerShutdownHandlers(client);

  console.log('Logging in to Discord gateway...');
  await client.login(config.token);

  return client;
}

const isMainModule =
  process.argv[1] !== undefined &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMainModule) {
  startBot().catch((error: unknown) => {
    console.error('Fatal error starting bot:', error);
    process.exit(1);
  });
}
