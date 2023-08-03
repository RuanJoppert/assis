import { BaseException } from '@modules/exception/exception.base';

export class AccountInvalidException extends BaseException {
  public code = 'ACCOUNT.INVALID_ACCOUNT';
}

export class AccountNotFoundException extends BaseException {
  public code = 'ACCOUNT.NOT_FOUND';
}

export class AccountAlreadyExistsException extends BaseException {
  public code = 'ACCOUNT.ALREADY_EXISTS';
}

export class TransferInsufficientFunds extends BaseException {
  public code = 'TRANSFER.INSUFFICIENT_FUNDS';
}

export class TransferInvalidDestinationException extends BaseException {
  public code = 'TRANSFER.INVALID_DESTINATION';
}
