import { OpenAPIV3_1 } from 'openapi-types';
import swaggerUiExpress from 'swagger-ui-express';
import { paths } from '../lib/swagger';
import { asPlugin } from '../lib/util/typings';

export default asPlugin(async function swagger(app, options: Options) {
  const { routePrefix } = options;

  app
    .use(routePrefix, swaggerUiExpress.serve)
    .get(routePrefix, swaggerUiExpress.setup(spec));
});

const spec: OpenAPIV3_1.Document = {
  openapi: '3.0.0',
  info: {
    title: 'Rest API',
    version: '0.0.1',
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Default local development server',
    },
  ],
  paths,
  components: {
    // securitySchemes: {
    //   bearerAuth: {
    //     type: 'http',
    //     scheme: 'bearer',
    //   },
    // },
  },
};

interface Options {
  routePrefix: string;
}
