import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { REST, Routes } from 'discord.js';
import { commandList } from './commands/index.js';
import { parseGuildDeployConfig } from './config.js';
import type { GuildDeployConfig } from './types.js';

export async function deployGuildCommands(
  customConfig?: GuildDeployConfig
): Promise<unknown> {
  const config = customConfig ?? parseGuildDeployConfig();
  const rest = new REST({ version: '10' }).setToken(config.token);

  const commandPayload = commandList.map((command) => command.data.toJSON());

  console.log(
    `Deploying ${commandPayload.length} slash command(s) to development guild (${config.guildId})...`
  );

  const result = await rest.put(
    Routes.applicationGuildCommands(config.clientId, config.guildId),
    { body: commandPayload }
  );

  const count = Array.isArray(result) ? result.length : commandPayload.length;
  console.log(`Successfully registered ${count} guild command(s).`);

  return result;
}

const isMainModule =
  process.argv[1] !== undefined &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMainModule) {
  deployGuildCommands().catch((error: unknown) => {
    console.error('Command deployment failed:', error);
    process.exit(1);
  });
}
