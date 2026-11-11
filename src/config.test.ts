import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { parseBotConfig, parseGuildDeployConfig } from './config.js';

describe('Configuration parsing and validation', () => {
  const validSnowflake = '123456789012345678';
  const validGuildSnowflake = '987654321098765432';
  const dummyToken = 'dummy-secret-token.abc.xyz';

  it('successfully parses valid bot config', () => {
    const config = parseBotConfig({
      DISCORD_TOKEN: dummyToken,
      DISCORD_CLIENT_ID: validSnowflake,
      DISCORD_GUILD_ID: validGuildSnowflake,
    });

    assert.equal(config.token, dummyToken);
    assert.equal(config.clientId, validSnowflake);
    assert.equal(config.guildId, validGuildSnowflake);
  });

  it('successfully parses bot config without optional guildId', () => {
    const config = parseBotConfig({
      DISCORD_TOKEN: dummyToken,
      DISCORD_CLIENT_ID: validSnowflake,
    });

    assert.equal(config.token, dummyToken);
    assert.equal(config.clientId, validSnowflake);
    assert.equal(config.guildId, undefined);
  });

  it('fails validation when token is missing and does not leak secrets', () => {
    assert.throws(
      () => {
        parseBotConfig({
          DISCORD_CLIENT_ID: validSnowflake,
        });
      },
      (err: Error) => {
        assert.ok(err.message.includes('DISCORD_TOKEN environment variable is required'));
        // Verify no token value or potential leaks
        assert.ok(!err.message.includes(dummyToken));
        return true;
      }
    );
  });

  it('fails validation when client ID is not a valid snowflake', () => {
    assert.throws(
      () => {
        parseBotConfig({
          DISCORD_TOKEN: dummyToken,
          DISCORD_CLIENT_ID: 'not-a-snowflake',
        });
      },
      (err: Error) => {
        assert.ok(err.message.includes('DISCORD_CLIENT_ID must be a valid Discord snowflake'));
        return true;
      }
    );
  });

  it('fails validation when optional guild ID is provided but invalid snowflake', () => {
    assert.throws(
      () => {
        parseBotConfig({
          DISCORD_TOKEN: dummyToken,
          DISCORD_CLIENT_ID: validSnowflake,
          DISCORD_GUILD_ID: 'short',
        });
      },
      (err: Error) => {
        assert.ok(err.message.includes('DISCORD_GUILD_ID must be a valid Discord snowflake'));
        return true;
      }
    );
  });

  it('parses valid guild deploy config', () => {
    const config = parseGuildDeployConfig({
      DISCORD_TOKEN: dummyToken,
      DISCORD_CLIENT_ID: validSnowflake,
      DISCORD_GUILD_ID: validGuildSnowflake,
    });

    assert.equal(config.token, dummyToken);
    assert.equal(config.clientId, validSnowflake);
    assert.equal(config.guildId, validGuildSnowflake);
  });

  it('fails guild deploy config when DISCORD_GUILD_ID is missing', () => {
    assert.throws(
      () => {
        parseGuildDeployConfig({
          DISCORD_TOKEN: dummyToken,
          DISCORD_CLIENT_ID: validSnowflake,
        });
      },
      (err: Error) => {
        assert.ok(err.message.includes('DISCORD_GUILD_ID environment variable is required'));
        return true;
      }
    );
  });
});
