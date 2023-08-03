import { BusPort, Handler } from './bus.port';

export class Bus implements BusPort {
  private handlers: Map<string, Handler<any, any>> = new Map();

  public register<T, U>(name: string, handler: Handler<T, U>): void {
    this.handlers.set(name, handler);
  }

  public handle<T, U>(name: string, query: T): Promise<U> {
    const handler = this.handlers.get(name);

    if (!handler) {
      throw new Error(`No handler registered for query ${name}`);
    }

    return handler.handle(query);
  }
}
