import { Router } from 'express';
import { BusPort } from '@providers/bus/bus.port';
import { DepositFundController } from './deposit-fund.controller';

export default (router: Router, bus: BusPort) => {
  const controller = new DepositFundController(bus);

  router.post('/accounts/:accountNumber/deposit', (req, res) => {
    controller.handle(req, res);
  });
};
