type Meta = Record<string, unknown>;

function write(level: "error" | "warn" | "info", event: string, meta?: Meta) {
  const entry = { level, event, ...meta, timestamp: new Date().toISOString() };
  const output = JSON.stringify(entry);
  if (level === "error") console.error(output);
  else if (level === "warn") console.warn(output);
  else if (process.env.NODE_ENV !== "production") console.info(output);
}

export const logger = {
  error: (event: string, meta?: Meta) => write("error", event, meta),
  warn: (event: string, meta?: Meta) => write("warn", event, meta),
  info: (event: string, meta?: Meta) => write("info", event, meta),
};
