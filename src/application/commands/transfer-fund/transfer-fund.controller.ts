import { Request, Response } from 'express';
import { BusPort } from '@providers/bus/bus.port';
import { TransferFundRequest } from './transfer-fund.request';
import { RequestInvalidException } from '@modules/exception/exception.common';
import {
  AccountNotFoundException,
  TransferInsufficientFunds,
} from '@modules/account/account.exceptions';

export class TransferFundController {
  public constructor(private readonly bus: BusPort) {}

  public async handle(req: Request, res: Response): Promise<void> {
    const { amount, from, to } = req.body;

    if (!amount || !from || !to) {
      res.sendStatus(400);
      return;
    }

    try {
      await this.bus.handle(
        'TransferFund',
        new TransferFundRequest(from, to, amount),
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

      if (error instanceof TransferInsufficientFunds) {
        res.status(409).send({
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
