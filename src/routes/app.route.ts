import { type RequestHandler, Router } from 'express';
import AppService from '../services/app.service';
import wrapper from '../lib/utils/express/wrapper';
import validate, { PROP } from '../lib/utils/express/validate';

export const autoPrefix: string | undefined = '/';

export const middlewares: RequestHandler[] = [];

export const app: Router = Router();

async function load() {
  const appService = await AppService.getInstance();

  app.post(
    '/message/reverse',

    /**
     * @openapi
     * /message/reverse:
     *  post:
     *    description: Reverse message value
     *    tags:
     *      - example
     *    security: []
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            type: object
     *            required:
     *              - message
     *            properties:
     *              message:
     *                type: string
     *                minLength: 1
     *                default: Hello, World!
     *    responses:
     *      200:
     *        description: Default
     */

    validate(PROP.Body, {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          minLength: 1,
        },
      },
      required: ['message'],
      additionalProperties: false,
    }),
    wrapper<
      RequestHandler<
        unknown, // req.params
        unknown, // res.body
        { message: string }, // req.body
        unknown // req.query
      >
    >(async function (request) {
      const message = request.body.message;
      const reversedText = await appService.getReversedText(message);

      return {
        message: reversedText,
      };
    }),
  );
}

void load();
