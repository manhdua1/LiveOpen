import {
  type Collection,
  type Interaction,
  type InteractionReplyOptions,
  MessageFlags,
} from 'discord.js';
import type { Command } from '../types.js';

export async function handleInteraction(
  interaction: Interaction,
  commands: Collection<string, Command>
): Promise<void> {
  if (!interaction.isChatInputCommand()) {
    return;
  }

  const command = commands.get(interaction.commandName);

  if (!command) {
    console.warn(`No slash command matching '/${interaction.commandName}' was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`Error executing slash command '/${interaction.commandName}':`, error);

    const errorMessage: InteractionReplyOptions = {
      content: 'There was an error while executing this command!',
      flags: MessageFlags.Ephemeral,
    };

    try {
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(errorMessage);
      } else {
        await interaction.reply(errorMessage);
      }
    } catch (responseError) {
      console.error('Failed to send error response to interaction:', responseError);
    }
  }
}
