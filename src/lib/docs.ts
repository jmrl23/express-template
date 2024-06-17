import type { OpenAPIV3_1 } from 'openapi-types';

const servers: Array<OpenAPIV3_1.ServerObject> = [
  {
    url: 'http://localhost:3001',
    description: 'Default local development server',
  },
];

export const spec: OpenAPIV3_1.Document & Record<string, unknown> = {
  openapi: '3.0.0',
  info: {
    title: 'Application API',
    version: '0.0.1',
  },
  servers,
  tags: [],
  paths: {},
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
};

export function addSpecPaths(paths: OpenAPIV3_1.PathsObject): void {
  for (const key in paths) {
    if (spec.paths) spec.paths[key] = paths[key];
  }
}
