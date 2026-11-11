import type {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from 'discord.js';

export type SupportedSlashCommandData =
  | SlashCommandBuilder
  | SlashCommandOptionsOnlyBuilder
  | SlashCommandSubcommandsOnlyBuilder;

export interface Command {
  data: SupportedSlashCommandData;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export interface BotConfig {
  token: string;
  clientId: string;
  guildId?: string;
}

export interface GuildDeployConfig {
  token: string;
  clientId: string;
  guildId: string;
}
