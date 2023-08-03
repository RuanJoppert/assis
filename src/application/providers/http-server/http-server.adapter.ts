import { BusPort } from '@providers/bus/bus.port';
import { LoggerPort } from '@providers/logger/logger.port';
import * as express from 'express';
import { glob } from 'glob';
import { resolve } from 'path';

export class HttpServer {
  public readonly app = express();

  constructor(
    private readonly bus: BusPort,
    private readonly logger: LoggerPort,
  ) {
    this.app.use(express.json());
  }

  public async start(): Promise<void> {
    await this.loadRoutes();
    await this.listen();
  }

  public async loadRoutes(pattern = '**/*http-route.[tj]s') {
    const routeFiles = await glob(pattern);

    for (const route of routeFiles) {
      const file = resolve(process.cwd(), route);
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const routeFn = require(file).default;

      routeFn(this.app, this.bus);
    }

    this.logger.info(`[${routeFiles.length}] routes loaded`);

    return this;
  }

  public async listen(port?: number) {
    if (!port) {
      port = parseInt(process.env.PORT || '3000', 10);
    }

    this.app.listen(port, () => {
      this.logger.info(`Server listening on port ${port}`);
    });

    return this;
  }
}
