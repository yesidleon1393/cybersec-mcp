import Anthropic from "@anthropic-ai/sdk";
import { config } from "./config.js";
import { logger } from "./logger.js";

const clientOptions = {
  apiKey: config.ANTHROPIC_API_KEY,
};

if (config.ANTHROPIC_API_BASE_URL) {
  clientOptions.baseURL = config.ANTHROPIC_API_BASE_URL;
}

const client = new Anthropic(clientOptions);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableError(error) {
  const status = error?.statusCode ?? error?.status;
  if (!error) return false;
  if (status && status >= 500) return true;
  const text = String(error.message || error.toString()).toLowerCase();
  return text.includes("timeout") || text.includes("network") || text.includes("ECONNRESET") || text.includes("ETIMEDOUT");
}

export async function askAnthropic({ userPrompt, systemPrompt, model, maxTokens }) {
  const payload = {
    model,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  };

  let attempt = 0;
  const maxAttempts = config.ANTHROPIC_API_RETRIES + 1;

  while (attempt < maxAttempts) {
    attempt += 1;
    logger.debug("Anthropic request", { attempt, maxAttempts, model, maxTokens });

    try {
      const response = await client.messages.create(payload, {
        timeout: config.ANTHROPIC_API_TIMEOUT_MS,
      });
      logger.debug("Anthropic response received", { attempt });
      return response;
    } catch (error) {
      logger.warn("Anthropic request failed", { attempt, error: error.message || error });
      if (attempt >= maxAttempts || !isRetryableError(error)) {
        logger.error("Anthropic request aborting", { attempt, maxAttempts });
        throw error;
      }

      const backoffMs = 500 * attempt;
      logger.info(`Retrying Anthropic request in ${backoffMs}ms...`);
      await sleep(backoffMs);
    }
  }

  throw new Error("Anthropic request failed after retries");
}
