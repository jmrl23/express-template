import { Router } from 'express';
import { wrapper } from '@jmrl23/express-helper';
import { AppService } from '../services/app.service';

export const controller = Router();

controller.get(
  '/message',
  wrapper(async function () {
    const appService = await AppService.getInstance();
    const message = await appService.getMessage();

    return {
      message,
    };
  }),
);
