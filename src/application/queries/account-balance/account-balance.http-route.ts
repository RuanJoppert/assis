import { Router } from 'express';
import { BusPort } from '@providers/bus/bus.port';
import { GetAccountBalanceController } from './account-balance.controller';

export default (router: Router, bus: BusPort) => {
  const controller = new GetAccountBalanceController(bus);

  router.get('/accounts/:accountNumber/balance', (req, res) => {
    controller.handle(req, res);
  });
};
