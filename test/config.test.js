import test from "node:test";
import assert from "node:assert";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const configUrl = new URL("../src/config.js", import.meta.url);

function restoreEnv(originalEnv) {
  for (const key of Object.keys(process.env)) {
    if (!(key in originalEnv)) {
      delete process.env[key];
    }
  }
  for (const [key, value] of Object.entries(originalEnv)) {
    process.env[key] = value;
  }
}

test("config loads valid environment variables", async () => {
  const originalEnv = { ...process.env };
  try {
    process.env.ANTHROPIC_API_KEY = "test-key";
    process.env.CLAUDE_MODEL = "claude-sonnet-4-20250514";
    process.env.CLAUDE_MAX_TOKENS = "2000";
    process.env.ANTHROPIC_API_TIMEOUT_MS = "15000";
    process.env.ANTHROPIC_API_RETRIES = "1";
    process.env.LOG_LEVEL = "debug";
    process.env.NODE_ENV = "test";

    const { config } = await import(`${configUrl.href}?cachebust=${Date.now()}`);

    assert.strictEqual(config.ANTHROPIC_API_KEY, "test-key");
    assert.strictEqual(config.CLAUDE_MODEL, "claude-sonnet-4-20250514");
    assert.strictEqual(config.CLAUDE_MAX_TOKENS, 2000);
    assert.strictEqual(config.ANTHROPIC_API_TIMEOUT_MS, 15000);
    assert.strictEqual(config.ANTHROPIC_API_RETRIES, 1);
    assert.strictEqual(config.LOG_LEVEL, "debug");
    assert.strictEqual(config.NODE_ENV, "test");
  } finally {
    restoreEnv(originalEnv);
  }
});
