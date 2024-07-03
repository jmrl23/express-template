import type { JSONSchema } from 'json-schema-to-ts';
import type { Router, Application } from 'express';

export type Schema = JSONSchema & Record<string, unknown>;

export function asJsonSchema<const T extends Schema>(schema: T): T {
  return schema;
}

interface RouteFunction {
  (router: Router): Promise<void>;
}
export function asRoute(fn: RouteFunction): RouteFunction {
  return fn;
}

type PluginFn<Options> = Options extends undefined
  ? (app: Application, options?: never) => Promise<void>
  : (app: Application, options: Options) => Promise<void>;
export function asPlugin<Options = undefined>(
  fn: PluginFn<Options>,
): PluginFn<Options> {
  return fn;
}
