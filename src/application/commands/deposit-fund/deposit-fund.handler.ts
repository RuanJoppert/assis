import {
  IAccountRepository,
  IDepositFundCommandHandler,
  IDepositFundRequest,
} from '@modules/account/account.types';
import { RequestInvalidException } from '@modules/exception/exception.common';
import { LoggerPort } from '@providers/logger/logger.port';

export class DepositFundCommandHandler implements IDepositFundCommandHandler {
  constructor(
    private readonly repository: IAccountRepository,
    private readonly logger: LoggerPort,
  ) {
    this.logger = this.logger.child({ component: 'DepositFundHandler' });
  }

  public async handle(request: IDepositFundRequest): Promise<void> {
    if (!request.isValid()) {
      this.logger.info('Invalid request', { request });

      throw new RequestInvalidException('Amount must be a positive number');
    }

    const { accountID, amount } = request;

    try {
      const account = await this.repository.findByAccountID(accountID);

      account.deposit(amount);

      await this.repository.updateAccount(account);

      this.logger.info('Fund deposited', {
        accountID,
        amount,
      });
    } catch (error) {
      this.logger.error('Error while depositing fund', {
        accountID,
        amount,
        error,
      });

      throw error;
    }
  }
}
