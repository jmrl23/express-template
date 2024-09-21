import { OpenAPIV3_1 } from 'openapi-types';
import { Schema } from '../../lib/common';

type ParamsIn = 'query' | 'path';

export class DocsService {
  constructor(public readonly document: OpenAPIV3_1.Document) {}

  public parameters(
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

  public schema<S extends Schema>(schema: S): Record<string, unknown> {
    return schema;
  }

  public paths(pathsObject: OpenAPIV3_1.PathsObject): void {
    if (!this.document.paths) this.document.paths = {};

    Object.assign(this.document.paths, pathsObject);
  }
}
