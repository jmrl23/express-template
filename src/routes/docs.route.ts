import { Router } from 'express';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';

const app = Router();

export const prefix = '/docs';

export default app;

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
    }),
  ),
);
