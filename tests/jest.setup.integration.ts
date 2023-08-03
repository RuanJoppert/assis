import { Express } from 'express';
import { Logger } from '@providers/logger/logger.adapter';
import { Bus } from '@providers/bus/bus.adapter';
import { HttpServer } from '@providers/http-server/http-server.adapter';
import { PoolAdapter } from '@providers/database/pg.adapter';
import { AccountRepository } from '@app/database/repositories/account/account.repository';
import { CreateAccountCommandHandler } from '@app/commands/create-account/create-account.handler';
import { TransferFundCommandHandler } from '@app/commands/transfer-fund/transfer-fund.handler';
import { DepositFundCommandHandler } from '@app/commands/deposit-fund/deposit-fund.handler';
import { GetAccountBalanceQueryHandler } from '@app/queries/account-balance/account-balance.handler';

let pool: PoolAdapter;
let logger: Logger;
let bus: Bus;
let app: Express;

// setup
beforeAll(async (): Promise<void> => {
  logger = new Logger({ level: 'silent' });
  bus = new Bus();

  pool = new PoolAdapter({
    connectionString: process.env.DB_URL_TEST,
    min: 5,
    max: 10,
  });

  // Initialize repositories
  const accountRepository = new AccountRepository(pool);

  // Initialize command handlers
  const createAccount = new CreateAccountCommandHandler(
    accountRepository,
    logger,
  );
  const transferFund = new TransferFundCommandHandler(
    accountRepository,
    logger,
  );
  const depositFund = new DepositFundCommandHandler(accountRepository, logger);

  // Initialize query handlers
  const getAccountBalance = new GetAccountBalanceQueryHandler(
    accountRepository,
    logger,
  );

  // Register command handlers
  bus.register('CreateAccount', createAccount);
  bus.register('TransferFund', transferFund);
  bus.register('DepositFund', depositFund);

  // Register query handlers
  bus.register('GetAccountBalance', getAccountBalance);

  ({ app } = await new HttpServer(bus, logger).loadRoutes());
});

export function getConnectionPool(): PoolAdapter {
  return pool;
}

export function getLogger(): Logger {
  return logger;
}

export function getTestApp(): Express {
  return app;
}
