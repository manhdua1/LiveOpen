import { Collection } from 'discord.js';
import type { Command } from '../types.js';
import { pingCommand } from './ping.js';

export const commandList: Command[] = [
  pingCommand,
];

export function buildCommandCollection(commands: Command[] = commandList): Collection<string, Command> {
  const collection = new Collection<string, Command>();
  for (const cmd of commands) {
    collection.set(cmd.data.name, cmd);
  }
  return collection;
}

export { pingCommand };
