import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const schema = z.object({
  ANTHROPIC_API_KEY: z.string().nonempty(),
  ANTHROPIC_API_BASE_URL: z.string().url().optional(),
  CLAUDE_MODEL: z.string().default("claude-sonnet-4-20250514"),
  CLAUDE_MAX_TOKENS: z
    .string()
    .regex(/^\d+$/, "CLAUDE_MAX_TOKENS must be a positive integer")
    .default("4096"),
  ANTHROPIC_API_TIMEOUT_MS: z
    .string()
    .regex(/^\d+$/, "ANTHROPIC_API_TIMEOUT_MS must be a positive integer")
    .default("30000"),
  ANTHROPIC_API_RETRIES: z
    .string()
    .regex(/^\d+$/, "ANTHROPIC_API_RETRIES must be a positive integer")
    .default("2"),
  MCP_SERVER_NAME: z.string().default("cybersecurity-professor"),
  MCP_SERVER_VERSION: z.string().default("1.0.0"),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const result = schema.safeParse(process.env);

if (!result.success) {
  console.error("[config] Invalid environment variables:", result.error.format());
  process.exit(1);
}

export const config = {
  ...result.data,
  CLAUDE_MAX_TOKENS: Number(result.data.CLAUDE_MAX_TOKENS),
  ANTHROPIC_API_TIMEOUT_MS: Number(result.data.ANTHROPIC_API_TIMEOUT_MS),
  ANTHROPIC_API_RETRIES: Number(result.data.ANTHROPIC_API_RETRIES),
};
