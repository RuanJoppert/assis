import { IDepositFundRequest } from '@modules/account/account.types';

export class DepositFundRequest implements IDepositFundRequest {
  public constructor(
    public readonly accountID: string,
    public readonly amount: number,
  ) {}

  public isValid(): boolean {
    const accountIDIsString = typeof this.accountID === 'string';
    const accountIDIsNotEmpty = this.accountID.length > 0;
    const accountIDIsNumeric = /^\d+$/.test(this.accountID);
    const amountIsNumber = typeof this.amount === 'number';
    const amountIsPositive = this.amount > 0;

    return (
      accountIDIsString &&
      accountIDIsNotEmpty &&
      accountIDIsNumeric &&
      amountIsNumber &&
      amountIsPositive
    );
  }
}
