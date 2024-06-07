import type { OpenAPIV3_1 } from 'openapi-types';

export const spec: OpenAPIV3_1.Document & Record<string, unknown> = {
  openapi: '3.0.0',
  info: {
    title: 'Sample API',
    version: '1.0.0',
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Default local development server',
    },
  ],
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
  hideUntagged: true,
};

export function addSpecPaths(paths: OpenAPIV3_1.PathsObject): void {
  for (const key in paths) {
    if (spec.paths) spec.paths[key] = paths[key];
  }
}
