import { BusPort } from '@providers/bus/bus.port';
import e, { Request, Response } from 'express';
import { CreateAccountRequest } from './create-account.request';
import { RequestInvalidException } from '@modules/exception/exception.common';
import {
  AccountAlreadyExistsException,
  AccountInvalidException,
} from '@modules/account/account.exceptions';

export class CreateAccountController {
  public constructor(private readonly bus: BusPort) {}

  public async handle(req: Request, res: Response): Promise<void> {
    const { account_number } = req.body;

    if (!account_number) {
      res.sendStatus(400);
      return;
    }

    try {
      await this.bus.handle(
        'CreateAccount',
        new CreateAccountRequest(account_number),
      );

      res.sendStatus(201);
    } catch (error) {
      if (
        error instanceof RequestInvalidException ||
        error instanceof AccountInvalidException
      ) {
        res.status(400).send({
          error: {
            code: error.code,
            message: error.message,
          },
        });
        return;
      }

      if (error instanceof AccountAlreadyExistsException) {
        res.status(409).send({
          error: {
            code: error.code,
            message: error.message,
          },
        });
        return;
      }

      res.sendStatus(500);
    }
  }
}
