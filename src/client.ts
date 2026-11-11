import { Client, type Collection, Events, GatewayIntentBits } from 'discord.js';
import { buildCommandCollection } from './commands/index.js';
import { handleInteraction } from './handlers/interaction.js';
import type { Command } from './types.js';

export function createDiscordClient(
  commands: Collection<string, Command> = buildCommandCollection()
): Client {
  const client = new Client({
    intents: [GatewayIntentBits.Guilds],
  });

  client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    await handleInteraction(interaction, commands);
  });

  client.on(Events.Error, (error) => {
    console.error('Discord client error:', error);
  });

  return client;
}

export function registerShutdownHandlers(client: Client): () => void {
  let shuttingDown = false;

  const shutdown = (signal: NodeJS.Signals) => {
    if (shuttingDown) {
      return;
    }
    shuttingDown = true;
    console.log(`Received ${signal}. Gracefully shutting down Discord client...`);

    void client
      .destroy()
      .then(() => {
        console.log('Discord client destroyed. Exiting.');
        process.exit(0);
      })
      .catch((err: unknown) => {
        console.error('Error during client shutdown:', err);
        process.exit(1);
      });
  };

  const onSigInt = () => shutdown('SIGINT');
  const onSigTerm = () => shutdown('SIGTERM');

  process.once('SIGINT', onSigInt);
  process.once('SIGTERM', onSigTerm);

  return () => {
    process.removeListener('SIGINT', onSigInt);
    process.removeListener('SIGTERM', onSigTerm);
  };
}
