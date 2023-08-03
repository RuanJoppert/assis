import { Bus } from '@providers/bus/bus.adapter';
import { Logger } from '@providers/logger/logger.adapter';
import { AccountRepository } from './database/repositories/account/account.repository';
import { CreateAccountCommandHandler } from './commands/create-account/create-account.handler';
import { HttpServer } from '@providers/http-server/http-server.adapter';
import { PoolAdapter } from '@providers/database/pg.adapter';
import { TransferFundCommandHandler } from './commands/transfer-fund/transfer-fund.handler';
import { GetAccountBalanceQueryHandler } from './queries/account-balance/account-balance.handler';
import { DepositFundCommandHandler } from './commands/deposit-fund/deposit-fund.handler';

export const bootstrap = async () => {
  const logger = new Logger({ level: 'debug' });
  const bus = new Bus();

  logger.info('Application starting');

  // Connect to database
  const pool = new PoolAdapter({
    connectionString: process.env.DB_URL,
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

  // Start HTTP server
  await new HttpServer(bus, logger).start();

  logger.info('Application started');
};

bootstrap();
