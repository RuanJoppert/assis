import { Account, AccountID } from './account.entity';

export interface IAccountRepository {
  /**
   * Create a new account
   * @param {Account} account The account
   * @throws {AccountAlreadyExistsException} When account already exists
   * @throws {*} When an unknown error occurs
   */
  createAccount(account: Account<AccountID>): Promise<void>;

  /**
   * Find an account by account number
   * @param {AccountID} accountID The account number
   * @throws {AccountNotFoundException} When account not found
   * @throws {AccountException} When state is invalid
   * @throws {*} When an unknown error occurs
   */
  findByAccountID(accountID: AccountID): Promise<Account<AccountID>>;

  /**
   * Find an account by account number for update
   * @param {AccountID} accountID The account number
   * @throws {AccountNotFoundException} When account not found
   * @throws {AccountException} When state is invalid
   * @throws {*} When an unknown error occurs
   * @returns {Account} The account
   */
  findByAccountIDForUpdate(accountID: AccountID): Promise<Account<AccountID>>;

  /**
   * Update an account
   * @param {Account} account The account
   * @throws {AccountNotFoundException} When account not found
   * @throws {*} When an unknown error occurs
   */
  updateAccount(account: Account<AccountID>): Promise<void>;

  /**
   * Cancel an account update
   * @param {AccountID} accountID The account number
   * @throws {*} When an unknown error occurs
   */
  cancelAccountUpdate(accountID: AccountID): Promise<void>;
}

export interface ICreateAccountCommandHandler {
  /**
   * Create a new account
   * @param {ICreateAccountRequest} request The request
   * @throws {RequestInvalidException} When request is not valid
   * @throws {AccountAlreadyExistsException} When account already exists
   * @throws {AccountInvalidException} When id is not defined
   * @throws {InternalServerErrorException} When an internal error occurs
   */
  handle(request: ICreateAccountRequest): Promise<void>;
}

export interface ICreateAccountRequest {
  accountID: string;
  isValid: () => boolean;
}

export interface ITransferFundCommandHandler {
  /**
   * Create a new account
   * @param {ITransferFundRequest} request The request
   * @throws {RequestInvalidException} When request is not valid
   * @throws {AccountNotFoundException} When account not found
   * @throws {TransferInsufficientFunds} When origin account has insufficient funds
   * @throws {TransferInvalidDestinationException} When destination account is invalid
   * @throws {AmountException} When amount is negative
   * @throws {InternalServerErrorException} When an internal error occurs
   */
  handle(request: ITransferFundRequest): Promise<void>;
}

export interface ITransferFundRequest {
  amount: number;
  originAccountID: string;
  destinationAccountID: string;
  isValid: () => boolean;
}

export interface IDepositFundCommandHandler {
  /**
   * Deposit fund
   * @param {IDepositFundRequest} request The request
   * @throws {RequestInvalidException} When request is not valid
   * @throws {AccountNotFoundException} When account not found
   * @throws {AmountException} When amount is negative
   * @throws {InternalServerErrorException} When an internal error occurs
   */
  handle(request: IDepositFundRequest): Promise<void>;
}

export interface IDepositFundRequest {
  amount: number;
  accountID: string;
  isValid: () => boolean;
}

export interface IGetAccountBalanceQueryHandler {
  /**
   * Get account balance
   * @param {IGetAccountBalanceRequest} request The request
   * @throws {RequestInvalidException} When request is not valid
   * @throws {AccountNotFoundException} When account not found
   * @throws {InternalServerErrorException} When an internal error occurs
   * @returns {IGetAccountBalanceResponse} The response
   */
  handle(
    request: IGetAccountBalanceRequest,
  ): Promise<IGetAccountBalanceResponse>;
}

export interface IGetAccountBalanceRequest {
  accountID: string;
  isValid: () => boolean;
}

export interface IGetAccountBalanceResponse {
  balance: number;
  deposits: number;
  transfers: number;
}
