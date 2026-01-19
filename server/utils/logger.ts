// Logging utility

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  data?: Record<string, any>;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatLog(entry: LogEntry): string {
    const { timestamp, level, message, context, data } = entry;
    const contextStr = context ? ` [${context}]` : '';
    const dataStr = data ? ` ${JSON.stringify(data)}` : '';
    return `[${timestamp}] ${level}${contextStr}: ${message}${dataStr}`;
  }

  private log(level: LogLevel, message: string, context?: string, data?: Record<string, any>): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      data,
    };

    const formatted = this.formatLog(entry);

    switch (level) {
      case LogLevel.DEBUG:
        if (this.isDevelopment) console.debug(formatted);
        break;
      case LogLevel.INFO:
        console.info(formatted);
        break;
      case LogLevel.WARN:
        console.warn(formatted);
        break;
      case LogLevel.ERROR:
        console.error(formatted);
        break;
    }
  }

  debug(message: string, context?: string, data?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context, data);
  }

  info(message: string, context?: string, data?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context, data);
  }

  warn(message: string, context?: string, data?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context, data);
  }

  error(message: string, context?: string, data?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, context, data);
  }
}

export const logger = new Logger();
