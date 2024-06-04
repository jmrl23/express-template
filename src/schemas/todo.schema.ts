import { asJsonSchema } from '../lib/util/express/typings';

export const todoCreateSchema = asJsonSchema({
  type: 'object',
  description: 'Create new todo item',
  additionalProperties: false,
  required: ['content'],
  properties: {
    content: {
      type: 'string',
      minLength: 1,
      examples: ['Walk the dog'],
    },
  },
} as const);

export const todoGetAllSchema = asJsonSchema({
  type: 'object',
  description: 'Get todo items',
  additionalProperties: false,
} as const);

export const todoGetSchema = asJsonSchema({
  type: 'object',
  description: 'Get todo item',
  additionalProperties: false,
  required: ['id'],
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
    },
  },
} as const);

export const todoUpdateSchema = asJsonSchema({
  type: 'object',
  description: 'Update todo item',
  additionalProperties: false,
  required: ['id'],
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
    },
    content: {
      type: 'string',
      minLength: 1,
      examples: ['Walk the dog'],
    },
    done: {
      type: 'boolean',
      examples: [false],
    },
  },
} as const);

export const todoDeleteSchema = asJsonSchema({
  type: 'object',
  description: 'Delete todo item',
  additionalProperties: false,
  required: ['id'],
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
    },
  },
} as const);
