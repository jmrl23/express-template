import fs from 'node:fs';
import path from 'node:path';
import { OpenAPIV3_1 } from 'openapi-types';
import swaggerUiExpress from 'swagger-ui-express';
import { asPlugin } from '../../lib/common';
import { DocsService } from './docsService';

interface Options {
  prefix: string;
  document?: OpenAPIV3_1.Document;
}

declare module 'express' {
  interface Application {
    docsService: DocsService;
  }
}

export default asPlugin<Options>(async function (
  app,
  options = {
    prefix: '/docs',
  },
) {
  if (!options.document) {
    const packageJson: Record<string, unknown> = JSON.parse(
      fs
        .readFileSync(path.resolve(__dirname, '../../../package.json'))
        .toString(),
    );
    const version: string =
      typeof packageJson.version === 'string' ? packageJson.version : '0.0.0';
    const servers: OpenAPIV3_1.ServerObject[] = [
      {
        url: 'http://localhost:3001',
        description: 'Default local development server',
      },
    ];
    options.document = {
      openapi: '3.0.0',
      info: {
        title: 'Rest API',
        version,
      },
      servers,
      paths: {},
      components: {
        // securitySchemes: {
        //   bearerAuth: {
        //     type: 'http',
        //     scheme: 'bearer',
        //   },
        // },
      },
    };
  }

  const docsService = new DocsService(options.document);

  app.docsService = docsService;
  app.use(options.prefix, swaggerUiExpress.serve);
  app.get(options.prefix, (req, res, done) => {
    swaggerUiExpress.setup(docsService.document)(req, res, done);
  });
});
