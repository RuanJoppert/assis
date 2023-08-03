import { BusPort } from '@providers/bus/bus.port';
import { Request, Response } from 'express';
import { DepositFundRequest } from './deposit-fund.request';
import { RequestInvalidException } from '@modules/exception/exception.common';
import { AccountNotFoundException } from '@modules/account/account.exceptions';

export class DepositFundController {
  public constructor(private readonly bus: BusPort) {}

  public async handle(req: Request, res: Response): Promise<void> {
    const { amount } = req.body;
    const { accountNumber } = req.params;

    if (!accountNumber || !amount) {
      res.sendStatus(400);
      return;
    }

    try {
      await this.bus.handle(
        'DepositFund',
        new DepositFundRequest(accountNumber, amount),
      );

      res.sendStatus(200);
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
        res.status(404).send({
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
