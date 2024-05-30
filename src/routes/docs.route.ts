import swaggerJsDoc, { type OAS3Options } from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import { asRoute } from '../lib/utils/express/typings';

export const prefix = '/docs';

export default asRoute(function docsRoute(app) {
  app.use(swaggerUiExpress.serve).get(
    '/',
    swaggerUiExpress.setup(
      swaggerJsDoc({
        definition: {
          openapi: '3.0.0',
          info: {
            title: 'App API',
            version: '1.0.0',
            description: 'App API docs',
          },
          servers: [
            {
              url: 'http://localhost:3001',
              description: 'Default local development server',
            },
          ],
          components: {
            securitySchemes: {
              bearerAuth: {
                type: 'http',
                scheme: 'bearer',
              },
            },
          },
          security: [
            {
              bearerAuth: [],
            },
          ],
          hideUntagged: true,
        },
        apis: ['src/routes/**/*.ts', 'build/routes/**/*.js'],
      } satisfies OAS3Options),
    ),
  );
});
