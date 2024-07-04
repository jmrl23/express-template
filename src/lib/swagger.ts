import type { OpenAPIV3_1 } from 'openapi-types';

/**
 * Swagger paths
 */
export const paths: OpenAPIV3_1.PathsObject = {};

export function registerPaths(pathsObject: OpenAPIV3_1.PathsObject): void {
  Object.assign(paths, pathsObject);
}
