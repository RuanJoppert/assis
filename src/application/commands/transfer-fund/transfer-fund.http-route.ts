import { Router } from 'express';
import { BusPort } from '@providers/bus/bus.port';
import { TransferFundController } from './transfer-fund.controller';

export default (router: Router, bus: BusPort) => {
  const controller = new TransferFundController(bus);

  router.post('/accounts/transfer', (req, res) => {
    controller.handle(req, res);
  });
};
