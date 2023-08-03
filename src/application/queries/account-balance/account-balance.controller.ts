import { Request, Response } from 'express';
import { GetAccountBalanceRequest } from './account-balance.request';
import { RequestInvalidException } from '@modules/exception/exception.common';
import { AccountNotFoundException } from '@modules/account/account.exceptions';
import { BusPort } from '@providers/bus/bus.port';

export class GetAccountBalanceController {
  public constructor(private readonly bus: BusPort) {}

  public async handle(req: Request, res: Response): Promise<void> {
    const { accountNumber } = req.params;

    if (!accountNumber) {
      res.sendStatus(400);
      return;
    }

    try {
      const response = await this.bus.handle(
        'GetAccountBalance',
        new GetAccountBalanceRequest(accountNumber),
      );

      res.status(200).send(response);
    } catch (error) {
      if (error instanceof RequestInvalidException) {
        res.status(400).send({
          error: {
            code: error.code,
            message: error.message,
          },
        });

        return;
      }

      if (error instanceof AccountNotFoundException) {
        res.sendStatus(404).send({
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
