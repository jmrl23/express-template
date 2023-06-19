import { Router } from 'express';
import { wrapper } from '../utils/express';
import { BadRequestException } from '../exceptions/http';

export const controller = Router();

controller

  .get(
    '/hello',
    wrapper(function () {
      return {
        message: 'Hello, World!',
      };
    }),
  )

  .get(
    '/error',
    wrapper(function () {
      throw new BadRequestException('Example error');
    }),
  );
