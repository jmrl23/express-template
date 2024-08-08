import { OpenAPIV3, OpenAPIV3_1 } from 'openapi-types';
import swaggerUiExpress from 'swagger-ui-express';
import { asPlugin } from '../lib/common';
import { paths } from '../lib/swagger';
import fs from 'node:fs';
import path from 'node:path';

interface Options {
  routePrefix: string;
}

export default asPlugin(async function swagger(app, options: Options) {
  const { routePrefix } = options;
  const packageJson: Record<string, unknown> = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../../package.json')).toString(),
  );
  const version: string =
    typeof packageJson.version === 'string' ? packageJson.version : '0.0.0';

  const servers: OpenAPIV3_1.ServerObject[] = [
    {
      url: 'http://localhost:3001',
      description: 'Default local development server',
    },
  ];

  const spec: OpenAPIV3_1.Document = {
    openapi: '3.0.0',
    info: {
      title: 'Rest API',
      version,
    },
    servers,
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

  app
    .use(routePrefix, swaggerUiExpress.serve)
    .get(routePrefix, swaggerUiExpress.setup(spec));
});
