import { paths } from '../../plugins/swagger';
import { Schema } from './typings';
import { OpenAPIV3_1 } from 'openapi-types';

type ParamsIn = 'query' | 'path';

export function describeParameters(
  paramIn: ParamsIn,
  schema: Schema,
  extraDefinitions: Record<string, unknown> = {},
): OpenAPIV3_1.ParameterObject[] {
  return Object.entries(schema.properties ?? {}).map(([key, value]) => {
    const required = Array.isArray(schema.required) ? schema.required : [];
    const description = {
      in: paramIn,
      name: key,
      required: required.includes(key),
      schema: value,
      ...extraDefinitions,
    };
    return description;
  });
}

export function describePaths(pathsObject: OpenAPIV3_1.PathsObject): void {
  Object.assign(paths, pathsObject);
}
