import { LoggerOptions, pino, Logger as pinoLogger } from 'pino';
import { LoggerPort } from './logger.port';

/**
 * Logger implementation using pino
 */
export class Logger implements LoggerPort {
  private logger: pinoLogger;
  private static config?: LoggerOptions;

  public constructor(options?: LoggerOptions) {
    // If no options are provided, level is set to info in production
    // and debug in development
    if (!options) {
      const level =
        process.env.LOG_LEVEL || process.env.NODE_ENV === 'production'
          ? 'info'
          : 'debug';

      options = {
        level,
      };
    }

    // If level is set to debug, use pino-pretty
    if (options.level === 'debug') {
      options.transport = {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
        ...options.transport,
      };
    }

    if (!Logger.config) {
      Logger.config = options;
    }

    this.logger = pino(options);
  }

  public error(msg: string, obj?: unknown, ...args: any[]): void {
    this.logger.error(obj, msg, ...args);
  }

  public info(msg: string, obj?: unknown, ...args: any[]): void {
    this.logger.info(obj, msg, ...args);
  }

  public warn(msg: string, obj?: unknown, ...args: any[]): void {
    this.logger.warn(obj, msg, ...args);
  }

  public debug(msg: string, obj?: unknown, ...args: any[]): void {
    this.logger.debug(obj, msg, ...args);
  }

  public child(component: Record<string, any>): LoggerPort {
    const logger = this.logger.child(component);

    return Logger.fromPino(logger);
  }

  public static fromPino(logger: pinoLogger): LoggerPort {
    const instance = new Logger(Logger.config);

    instance.logger = logger;

    return instance;
  }
}
