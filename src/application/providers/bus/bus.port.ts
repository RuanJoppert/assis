export interface BusPort {
  register<T, U>(name: string, handler: Handler<T, U>): void;
  handle<T, U>(name: string, query: T): Promise<U>;
}

export interface Handler<T, U> {
  handle(query: T): Promise<U>;
}
