import { Router } from 'express';
import AppService from '../services/app.service';
import wrapper from '../lib/utils/express/wrapper';
import validate, { PROP } from '../lib/utils/express/validate';
import type { FromSchema, JSONSchema } from 'json-schema-to-ts';

const app = Router();

export default app;

async function load() {
  const appService = await AppService.getInstance();

  const messageReverseBodySchema = {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        minLength: 1,
      },
    },
    required: ['message'],
    additionalProperties: false,
  } as const satisfies JSONSchema;

  app.post(
    '/message/reverse',

    /**
     * @openapi
     *
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

    validate(PROP.Body, messageReverseBodySchema),
    wrapper<
      // req.body
      FromSchema<typeof messageReverseBodySchema>,
      // req.params
      unknown,
      // req.query
      unknown
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
