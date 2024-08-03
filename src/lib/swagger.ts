import { OpenAPIV3_1 } from 'openapi-types';

// swagger spec paths reference
export const paths: OpenAPIV3_1.PathsObject = {};

export function registerPaths(pathsObject: OpenAPIV3_1.PathsObject): void {
  Object.assign(paths, pathsObject);
}
