import type { FromSchema } from 'json-schema-to-ts';
import { asJsonSchema } from '../lib/util/typings';

export const todoSchema = asJsonSchema({
  type: 'object',
  description: 'Todo item',
  required: ['id', 'createdAt', 'updatedAt', 'content', 'done'],
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
    },
    content: {
      type: 'string',
      examples: ['Walk the dog'],
    },
    done: {
      type: 'boolean',
      examples: [false],
    },
  },
});
export type TodoSchema = FromSchema<typeof todoSchema>;

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
});
export type TodoCreateSchema = FromSchema<typeof todoCreateSchema>;

export const todoGetAllSchema = asJsonSchema({
  type: 'object',
  description: 'Get todo items',
  additionalProperties: false,
});
export type TodoGetAllSchema = FromSchema<typeof todoGetAllSchema>;

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
});
export type TodoGetSchema = FromSchema<typeof todoGetSchema>;

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
      examples: [true],
    },
  },
});
export type TodoUpdateSchema = FromSchema<typeof todoUpdateSchema>;

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
});
export type TodoDeleteSchema = FromSchema<typeof todoDeleteSchema>;

export const todoResponse200 = asJsonSchema({
  type: 'object',
  description: 'Response todo item',
  required: ['todo'],
  additionalProperties: false,
  properties: {
    todo: { ...todoSchema, nullable: true },
  },
});
export type TodoResponse200 = FromSchema<typeof todoResponse200>;

export const todosResponse200 = asJsonSchema({
  type: 'object',
  description: 'Response todo items',
  required: ['todos'],
  additionalProperties: false,
  properties: {
    todos: {
      type: 'array',
      items: { ...todoSchema, nullable: true },
    },
  },
});
export type TodosResponse200 = FromSchema<typeof todoResponse200>;
