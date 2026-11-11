import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { GatewayIntentBits } from 'discord.js';
import { createDiscordClient, registerShutdownHandlers } from './client.js';

describe('Discord Client Factory', () => {
  it('configures client with Guilds intent only', () => {
    const client = createDiscordClient();

    try {
      assert.ok(client.options.intents.has(GatewayIntentBits.Guilds));
      assert.equal(client.options.intents.bitfield, GatewayIntentBits.Guilds);
    } finally {
      client.destroy();
    }
  });

  it('registers shutdown listeners and allows cleanup', () => {
    const client = createDiscordClient();

    try {
      const sigintListenersBefore = process.listeners('SIGINT').length;
      const cleanup = registerShutdownHandlers(client);
      const sigintListenersDuring = process.listeners('SIGINT').length;

      assert.equal(sigintListenersDuring, sigintListenersBefore + 1);

      cleanup();
      const sigintListenersAfter = process.listeners('SIGINT').length;
      assert.equal(sigintListenersAfter, sigintListenersBefore);
    } finally {
      client.destroy();
    }
  });
});
