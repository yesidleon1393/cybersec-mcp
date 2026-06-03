import { config } from "./config.js";

const LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const currentLevel = LEVELS[config.LOG_LEVEL] ?? LEVELS.info;

function format(level, args) {
  const prefix = `[${new Date().toISOString()}] [${level.toUpperCase()}]`;
  return [prefix, ...args];
}

export const logger = {
  debug: (...args) => {
    if (currentLevel >= LEVELS.debug) {
      console.debug(...format("debug", args));
    }
  },
  info: (...args) => {
    if (currentLevel >= LEVELS.info) {
      console.info(...format("info", args));
    }
  },
  warn: (...args) => {
    if (currentLevel >= LEVELS.warn) {
      console.warn(...format("warn", args));
    }
  },
  error: (...args) => {
    if (currentLevel >= LEVELS.error) {
      console.error(...format("error", args));
    }
  },
};
