import { Router } from 'express';
import { CreateAccountController } from './create-account.controller';
import { BusPort } from '@providers/bus/bus.port';

export default (router: Router, bus: BusPort) => {
  const controller = new CreateAccountController(bus);

  router.post('/accounts', (req, res) => {
    controller.handle(req, res);
  });
};
