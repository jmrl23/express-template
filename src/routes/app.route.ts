import AppService from '../services/app.service';
import wrapper from '../lib/util/express/wrapper';
import validate, { PROP } from '../lib/util/express/validate';
import type { FromSchema } from 'json-schema-to-ts';
import { asJsonSchema, asRoute } from '../lib/util/express/typings';

export default asRoute(async function appRoute(app) {
  const appService = await AppService.getInstance();

  const messageReverseBodySchema = asJsonSchema({
    type: 'object',
    properties: {
      message: {
        type: 'string',
        minLength: 1,
      },
    },
    required: ['message'],
    additionalProperties: false,
  } as const);

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
});
