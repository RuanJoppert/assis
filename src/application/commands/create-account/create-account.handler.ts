import { Account } from '@modules/account/account.entity';
import { AccountAlreadyExistsException } from '@modules/account/account.exceptions';
import {
  IAccountRepository,
  ICreateAccountCommandHandler,
  ICreateAccountRequest,
} from '@modules/account/account.types';
import {
  InternalServerErrorException,
  RequestInvalidException,
} from '@modules/exception/exception.common';
import { LoggerPort } from '@providers/logger/logger.port';

export class CreateAccountCommandHandler
  implements ICreateAccountCommandHandler
{
  constructor(
    private readonly repository: IAccountRepository,
    private readonly logger: LoggerPort,
  ) {
    this.logger = this.logger.child({ component: 'CreateAccountHandler' });
  }

  public async handle(request: ICreateAccountRequest): Promise<void> {
    if (!request.isValid()) {
      this.logger.info('Invalid request', { request });

      throw new RequestInvalidException(
        'Account number must be a string with numbers only',
      );
    }

    const { accountID } = request;

    const account = Account.create(accountID);

    try {
      await this.repository.createAccount(account);

      this.logger.info('Account created', {
        accountID,
      });
    } catch (error) {
      if (error instanceof AccountAlreadyExistsException) {
        this.logger.warn('Account already exists', {
          accountID,
        });

        throw error;
      }

      this.logger.error('Error while creating account', {
        accountID,
        error,
      });

      throw new InternalServerErrorException(
        'Error while creating account',
        error,
      );
    }
  }
}
