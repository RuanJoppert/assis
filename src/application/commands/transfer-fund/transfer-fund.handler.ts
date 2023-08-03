import {
  IAccountRepository,
  ITransferFundCommandHandler,
  ITransferFundRequest,
} from '@modules/account/account.types';
import { RequestInvalidException } from '@modules/exception/exception.common';
import { LoggerPort } from '@providers/logger/logger.port';

export class TransferFundCommandHandler implements ITransferFundCommandHandler {
  constructor(
    private readonly repository: IAccountRepository,
    private readonly logger: LoggerPort,
  ) {
    this.logger = this.logger.child({ component: 'TransferFundHandler' });
  }

  public async handle(request: ITransferFundRequest): Promise<void> {
    if (!request.isValid()) {
      this.logger.info('Invalid request', { request });

      throw new RequestInvalidException('Invalid request');
    }

    const amount = +request.amount;

    try {
      const originAccount = await this.repository.findByAccountIDForUpdate(
        request.originAccountID,
      );

      const destinationAccount = await this.repository.findByAccountID(
        request.destinationAccountID,
      );

      originAccount.transfer(amount, destinationAccount);

      await this.repository.updateAccount(originAccount);
      await this.repository.updateAccount(destinationAccount);
    } catch (error) {
      this.logger.error('Error while transferring funds', {
        amount,
        error,
        originAccountID: request.originAccountID,
        destinationAccountID: request.destinationAccountID,
      });

      this.repository.cancelAccountUpdate(request.originAccountID);

      throw error;
    }
  }
}
