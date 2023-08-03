import { BaseException } from '@modules/exception/exception.base';

export class AmountException extends BaseException {
  public code = 'AMOUNT.INVALID_VALUE';
}
