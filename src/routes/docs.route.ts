import swaggerJsDoc, { type OAS3Options, type Server } from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import { asRoute } from '../lib/util/typings';

export const prefix = '/docs';

export default asRoute(function docsRoute(app) {
  const servers: Server[] = [
    {
      url: 'http://localhost:3001',
      description: 'Default local development server',
    },
  ];

  app.use(swaggerUiExpress.serve).get(
    '/',
    swaggerUiExpress.setup(
      swaggerJsDoc({
        definition: {
          openapi: '3.0.0',
          info: {
            title: 'Sample API',
            version: '1.0.0',
          },
          servers,
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
