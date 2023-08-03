import {
  IAccountRepository,
  IGetAccountBalanceQueryHandler,
  IGetAccountBalanceRequest,
  IGetAccountBalanceResponse,
} from '@modules/account/account.types';
import { RequestInvalidException } from '@modules/exception/exception.common';
import { LoggerPort } from '@providers/logger/logger.port';

export class GetAccountBalanceQueryHandler
  implements IGetAccountBalanceQueryHandler
{
  constructor(
    private readonly repository: IAccountRepository,
    private readonly logger: LoggerPort,
  ) {
    this.logger = this.logger.child({ component: 'GetAccountBalanceHandler' });
  }

  public async handle(
    request: IGetAccountBalanceRequest,
  ): Promise<IGetAccountBalanceResponse> {
    if (!request.isValid()) {
      this.logger.info('Invalid request', { request });

      throw new RequestInvalidException('Invalid request');
    }

    try {
      const account = await this.repository.findByAccountID(request.accountID);

      return {
        balance: account.balance,
        deposits: account.depositCount,
        transfers: account.transferCount,
      };
    } catch (error) {
      this.logger.error('Error while getting account balance', {
        error,
        accountID: request.accountID,
      });

      throw error;
    }
  }
}
