import {
  AccountInvalidException,
  TransferInvalidDestinationException,
  TransferInsufficientFunds,
} from './account.exceptions';
import { Amount } from './amount/amount.value-object';

/**
 * Account entity
 */
export class Account<T extends AccountID> {
  public readonly id: T;
  public transactions: Transaction[] = [];

  #currentBalance: Amount;
  #state?: AccountState;

  /**
   * Create a new Account
   * @param {AccountID} id The account id
   * @param {Amount} balance The initial balance
   * @param {AccountState} state The account state
   * @throws {AccountInvalidException} When account id is not defined
   */
  private constructor(id: T, balance: Amount, state?: AccountState) {
    if (!id) {
      throw new AccountInvalidException('Account ID must be defined');
    }

    this.id = id;
    this.#currentBalance = balance;
    this.#state = state;
  }

  /**
   * Create a new Account
   * @param {AccountID} id The account id
   * @throws {AccountInvalidException} When id is not defined
   * @returns {Account} The new account
   */
  public static create<T extends AccountID>(id: T): Account<T> {
    const account = new Account(id, Amount.create());

    return account;
  }

  /**
   * Restore an account from a state
   * @param {AccountID} id The account id
   * @param {AccountState} state The account state
   * @throws {AccountException} When state is not provided
   * @returns {Account} The restored account
   */
  public static restore<T extends AccountID>(
    id: T,
    state: AccountState,
  ): Account<T> {
    if (!state || !state.balance || !state.transactions) {
      throw new AccountInvalidException('Account state must be defined');
    }

    return new Account(id, state.balance, state);
  }

  /**
   * Deposit an amount into the account
   * @param {number} amount The amount in cents values
   * @throws {AmountException} When amount is negative
   * @returns {void}
   */
  public deposit(amount: number): void {
    this.#currentBalance.add(amount);

    this.transactions.push({
      type: TransactionType.DEPOSIT,
      amount,
    });
  }

  /**
   * Transfer an amount to another account
   * @param {number} amount The amount of money to transfer
   * @param {Account} destination The target account
   * @throws {TransferInsufficientFunds} When account has insufficient funds
   * @throws {TransferInvalidDestinationException} When destination is not found
   * @throws {AmountException} When amount is negative
   * @returns {void}
   */
  public transfer(amount: number, destination: Account<T>): void {
    if (this.#currentBalance.value < amount) {
      throw new TransferInsufficientFunds('Insufficient funds');
    }

    if (!destination || this.id === destination.id) {
      throw new TransferInvalidDestinationException('Invalid target account');
    }

    this.#currentBalance.subtract(amount);

    this.transactions.push({
      type: TransactionType.TRANSFER,
      amount,
      from: this.id,
      to: destination.id,
    });

    destination.receiveTransfer(amount, this);
  }

  /**
   * Receive a transfer from another account
   * @param {number} amount The amount of money to receive
   * @param {Account} origin The origin account
   * @throws {AmountException} When amount is negative
   * @returns {void}
   */
  private receiveTransfer(amount: number, origin: Account<T>): void {
    this.#currentBalance.add(amount);

    this.transactions.push({
      type: TransactionType.TRANSFER,
      amount,
      from: origin.id,
      to: this.id,
    });
  }

  /**
   * Get the current balance of the account
   * @returns {number} The current balance
   */
  public get balance(): number {
    return this.#currentBalance.value;
  }

  /**
   * Get the number of deposits made to the account
   * @returns {number} The number of deposits
   */
  public get depositCount(): number {
    const deposit = this.transactions.filter(
      (transaction) => transaction.type === TransactionType.DEPOSIT,
    ).length;

    return deposit + (this.#state?.transactions.deposit ?? 0);
  }

  /**
   * Get the number of transfers made from or to the account
   * @returns {number} The number of transfers
   */
  public get transferCount(): number {
    const transfer = this.transactions.filter(
      (transaction) => transaction.type === TransactionType.TRANSFER,
    ).length;

    return transfer + (this.#state?.transactions.transfer ?? 0);
  }
}

/**
 * AccountState represents the initial state of an account, is used to
 * Recreate the state of an account from a snapshot.
 */
export type AccountState = {
  balance: Amount;
  transactions: {
    deposit: number;
    transfer: number;
  };
};

/**
 * Account id type
 */
export type AccountID = unknown;

/**
 * Transaction enum
 */
export enum TransactionType {
  DEPOSIT = 'deposit',
  TRANSFER = 'transfer',
}

/**
 * Deposit transaction
 */
type Deposit = {
  type: TransactionType.DEPOSIT;
  amount: number;
};

/**
 * Transfer transaction
 */
type Transfer = {
  type: TransactionType.TRANSFER;
  amount: number;
  from: AccountID;
  to: AccountID;
};

/**
 * Transaction type
 */
export type Transaction = Deposit | Transfer;
