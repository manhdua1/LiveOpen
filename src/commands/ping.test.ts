import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { ChatInputCommandInteraction } from 'discord.js';
import { pingCommand } from './ping.js';

describe('/ping command', () => {
  it('has expected command metadata', () => {
    const json = pingCommand.data.toJSON();
    assert.equal(json.name, 'ping');
    assert.equal(json.description, 'Replies with Pong!');
  });

  it('replies with Pong! when executed', async () => {
    const replies: unknown[] = [];
    const mockInteraction = {
      reply: async (payload: unknown) => {
        replies.push(payload);
        return {} as never;
      },
    } as unknown as ChatInputCommandInteraction;

    await pingCommand.execute(mockInteraction);

    assert.equal(replies.length, 1);
    assert.equal(replies[0], 'Pong!');
  });
});
