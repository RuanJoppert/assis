export interface LoggerPort {
  debug(msg: string, obj?: unknown, ...args: any[]): void;
  info(msg: string, obj?: unknown, ...args: any[]): void;
  warn(msg: string, obj?: unknown, ...args: any[]): void;
  error(msg: string, obj?: unknown, ...args: any[]): void;
  child(context: Record<string, any>): LoggerPort;
}
