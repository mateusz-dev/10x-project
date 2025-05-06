type LogLevel = "info" | "warn" | "error";
type LogContext = Record<string, unknown>;

const logMessage = (level: LogLevel, component: string, message: string, context?: LogContext) => {
  // In production, this could be replaced with proper logging service
  // eslint-disable-next-line no-console
  console[level](`[${component}] ${message}`, context);
};

export const logger = {
  info: (component: string, message: string, context?: LogContext) => logMessage("info", component, message, context),
  warn: (component: string, message: string, context?: LogContext) => logMessage("warn", component, message, context),
  error: (component: string, message: string, context?: LogContext) => logMessage("error", component, message, context),
};
