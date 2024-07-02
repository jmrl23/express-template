import type { JSONSchema } from 'json-schema-to-ts';
import type { Router } from 'express';

export type Schema = JSONSchema & Record<string, unknown>;

export function asJsonSchema<const T extends Schema>(schema: T): T {
  return schema;
}
interface RouteFunction {
  (router: Router): unknown;
}

export function asRoute(fn: RouteFunction): RouteFunction {
  return fn;
}
