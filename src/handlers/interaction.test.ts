import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { Collection, type Interaction, MessageFlags } from 'discord.js';
import { handleInteraction } from './interaction.js';
import type { Command } from '../types.js';

describe('handleInteraction', () => {
  it('ignores non-chat-input interactions', async () => {
    let executed = false;
    const mockCommand: Command = {
      data: { name: 'test', description: 'test', toJSON: () => ({}) } as never,
      execute: async () => {
        executed = true;
      },
    };

    const commands = new Collection<string, Command>([['test', mockCommand]]);
    const nonChatInputInteraction = {
      isChatInputCommand: () => false,
    } as unknown as Interaction;

    await handleInteraction(nonChatInputInteraction, commands);
    assert.equal(executed, false);
  });

  it('handles unknown command without throwing', async () => {
    const commands = new Collection<string, Command>();
    const unknownInteraction = {
      isChatInputCommand: () => true,
      commandName: 'unknown',
    } as unknown as Interaction;

    await handleInteraction(unknownInteraction, commands);
  });

  it('executes matching command successfully', async () => {
    let executedWithInteraction = false;
    const mockCommand: Command = {
      data: { name: 'test', description: 'test', toJSON: () => ({}) } as never,
      execute: async () => {
        executedWithInteraction = true;
      },
    };

    const commands = new Collection<string, Command>([['test', mockCommand]]);
    const chatInputInteraction = {
      isChatInputCommand: () => true,
      commandName: 'test',
    } as unknown as Interaction;

    await handleInteraction(chatInputInteraction, commands);
    assert.equal(executedWithInteraction, true);
  });

  it('replies with ephemeral error message when execution throws and unreplied', async () => {
    const failingCommand: Command = {
      data: { name: 'fail', description: 'fail', toJSON: () => ({}) } as never,
      execute: async () => {
        throw new Error('Command crashed');
      },
    };

    const commands = new Collection<string, Command>([['fail', failingCommand]]);
    const replyCalls: unknown[] = [];
    const chatInputInteraction = {
      isChatInputCommand: () => true,
      commandName: 'fail',
      replied: false,
      deferred: false,
      reply: async (arg: unknown) => {
        replyCalls.push(arg);
      },
    } as unknown as Interaction;

    await handleInteraction(chatInputInteraction, commands);

    assert.equal(replyCalls.length, 1);
    assert.deepEqual(replyCalls[0], {
      content: 'There was an error while executing this command!',
      flags: MessageFlags.Ephemeral,
    });
  });

  it('sends followUp with ephemeral error message when execution throws and already replied', async () => {
    const failingCommand: Command = {
      data: { name: 'fail', description: 'fail', toJSON: () => ({}) } as never,
      execute: async () => {
        throw new Error('Command crashed after reply');
      },
    };

    const commands = new Collection<string, Command>([['fail', failingCommand]]);
    const followUpCalls: unknown[] = [];
    const chatInputInteraction = {
      isChatInputCommand: () => true,
      commandName: 'fail',
      replied: true,
      deferred: false,
      followUp: async (arg: unknown) => {
        followUpCalls.push(arg);
      },
    } as unknown as Interaction;

    await handleInteraction(chatInputInteraction, commands);

    assert.equal(followUpCalls.length, 1);
    assert.deepEqual(followUpCalls[0], {
      content: 'There was an error while executing this command!',
      flags: MessageFlags.Ephemeral,
    });
  });
});
