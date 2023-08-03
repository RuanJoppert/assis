import { ICreateAccountRequest } from '@modules/account/account.types';

export class CreateAccountRequest implements ICreateAccountRequest {
  constructor(public readonly accountID: string) {}

  isValid(): boolean {
    const accountIDIsString = typeof this.accountID === 'string';
    const accountIDIsNotEmpty = this.accountID.length > 0;
    const accountIDIsNumeric = /^\d+$/.test(this.accountID);

    return accountIDIsString && accountIDIsNotEmpty && accountIDIsNumeric;
  }
}
