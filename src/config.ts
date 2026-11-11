import dotenv from 'dotenv';
import type { BotConfig, GuildDeployConfig } from './types.js';

function sanitizeEnvValue(val: unknown): string {
  if (typeof val !== 'string') return '';
  return val.trim();
}

export function parseBotConfig(env?: NodeJS.ProcessEnv): BotConfig {
  if (!env) {
    dotenv.config();
  }
  const sourceEnv = env ?? process.env;

  const token = sanitizeEnvValue(sourceEnv['DISCORD_TOKEN']);
  const clientId = sanitizeEnvValue(sourceEnv['DISCORD_CLIENT_ID']);
  const guildId = sanitizeEnvValue(sourceEnv['DISCORD_GUILD_ID']);

  const errors: string[] = [];

  if (!token) {
    errors.push('DISCORD_TOKEN environment variable is required and must not be empty.');
  }

  if (!clientId) {
    errors.push('DISCORD_CLIENT_ID environment variable is required and must not be empty.');
  } else if (!/^\d{17,20}$/.test(clientId)) {
    errors.push('DISCORD_CLIENT_ID must be a valid Discord snowflake (17-20 digits).');
  }

  if (guildId && !/^\d{17,20}$/.test(guildId)) {
    errors.push('DISCORD_GUILD_ID must be a valid Discord snowflake (17-20 digits) when provided.');
  }

  if (errors.length > 0) {
    // Note: Do not include token or raw values in error message to prevent secret leaks
    throw new Error(`Bot configuration validation failed:\n- ${errors.join('\n- ')}`);
  }

  return {
    token,
    clientId,
    ...(guildId ? { guildId } : {}),
  };
}

export function parseGuildDeployConfig(env?: NodeJS.ProcessEnv): GuildDeployConfig {
  const baseConfig = parseBotConfig(env);
  const sourceEnv = env ?? process.env;
  const guildId = sanitizeEnvValue(sourceEnv['DISCORD_GUILD_ID']);

  if (!guildId) {
    throw new Error(
      'Guild deployment failed: DISCORD_GUILD_ID environment variable is required and must not be empty.'
    );
  }

  return {
    token: baseConfig.token,
    clientId: baseConfig.clientId,
    guildId,
  };
}
