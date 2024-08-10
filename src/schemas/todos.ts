import { asJsonSchema } from '../lib/common';

export const todoSchema = asJsonSchema({
  type: 'object',
  additionalProperties: false,
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

export const todoCreateSchema = asJsonSchema({
  type: 'object',
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

export const todosGetSchema = asJsonSchema({
  type: 'object',
  additionalProperties: false,
  properties: {
    revalidate: {
      type: 'boolean',
    },
    content: {
      type: 'string',
      minLength: 1,
    },
    done: {
      type: 'boolean',
    },
    skip: {
      type: 'number',
      minimum: 0,
    },
    take: {
      type: 'number',
      minimum: 0,
    },
  },
});

export const todoGetSchema = asJsonSchema({
  type: 'object',
  additionalProperties: false,
  required: ['id'],
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
    },
  },
});

export const todoUpdateSchema = asJsonSchema({
  type: 'object',
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

export const todoDeleteSchema = asJsonSchema({
  type: 'object',
  additionalProperties: false,
  required: ['id'],
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
    },
  },
});
