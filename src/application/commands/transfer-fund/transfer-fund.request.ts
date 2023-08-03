import { ITransferFundRequest } from '@modules/account/account.types';

export class TransferFundRequest implements ITransferFundRequest {
  public constructor(
    public readonly originAccountID: string,
    public readonly destinationAccountID: string,
    public readonly amount: number,
  ) {}

  public isValid(): boolean {
    const originAccountIDIsString = typeof this.originAccountID === 'string';
    const originAccountIDIsNotEmpty = this.originAccountID.length > 0;

    const destinationAccountIDIsString =
      typeof this.destinationAccountID === 'string';
    const destinationAccountIDIsNotEmpty = this.destinationAccountID.length > 0;

    const amountIsNumber = typeof this.amount === 'number';
    const amountIsPositive = this.amount > 0;

    return (
      originAccountIDIsString &&
      originAccountIDIsNotEmpty &&
      destinationAccountIDIsString &&
      destinationAccountIDIsNotEmpty &&
      amountIsNumber &&
      amountIsPositive
    );
  }
}
