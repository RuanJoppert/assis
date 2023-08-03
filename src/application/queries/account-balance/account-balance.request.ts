export class GetAccountBalanceRequest {
  public constructor(public readonly accountID: string) {}

  public isValid(): boolean {
    const accountIDIsString = typeof this.accountID === 'string';
    const accountIDIsNotEmpty = this.accountID.length > 0;
    const accountIDIsNumeric = /^\d+$/.test(this.accountID);

    return accountIDIsString && accountIDIsNotEmpty && accountIDIsNumeric;
  }
}
