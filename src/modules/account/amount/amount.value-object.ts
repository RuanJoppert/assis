import { AmountException } from './amount.exceptions';

/**
 * Amount represents a monetary value
 */
export class Amount {
  #value: number;

  /**
   * Create a new Amount
   * @param {number} value The value of Amount in cents
   */
  private constructor(value: number) {
    this.#value = value;
  }

  /**
   * Create a new Amount
   * @returns {Amount} A new Amount
   */
  public static create(): Amount {
    return new Amount(0);
  }

  /**
   * Restore an Amount
   * @param {number} value The value of Amount in cents
   * @returns {Amount} A new Amount
   */
  public static from(value: number): Amount {
    return new Amount(+value);
  }

  /**
   * Return the value in cents
   * @returns {number} The value in cents
   */
  public get value(): number {
    return this.#value;
  }

  /**
   * Return the value in decimal format with two decimal places
   * @returns {string} The value in decimal format
   */
  public get string(): string {
    return (this.#value / 100).toFixed(2);
  }

  /**
   * Add an amount to the current amount
   * @param {Amount} amount The amount to be added
   * @throws {AmountException} When amount is negative
   * @returns {void}
   */
  public add(amount: number): void {
    amount = +amount;

    if (amount <= 0) {
      throw new AmountException('Amount must be greater than zero');
    }

    this.#value += amount;
  }

  /**
   * Subtract an amount from the current amount
   * @param {Amount} amount The amount to be subtracted
   * @throws {AmountException} When amount is negative
   * @returns {void}
   */
  public subtract(amount: number): void {
    amount = +amount;

    if (amount <= 0) {
      throw new AmountException('Amount must be greater than zero');
    }

    this.#value -= amount;
  }
}
