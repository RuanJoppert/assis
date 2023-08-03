import { BaseException } from '@modules/exception/exception.base';

export class RequestInvalidException extends BaseException {
  public code = 'BAD_REQUEST';
}

export class InternalServerErrorException extends BaseException {
  public code = 'INTERNAL_SERVER_ERROR';
}
