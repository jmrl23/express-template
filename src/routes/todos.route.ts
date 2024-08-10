import { caching, memoryStore } from 'cache-manager';
import { FromSchema } from 'json-schema-to-ts';
import { asJsonSchema, asRoute, validate, wrapper } from '../lib/common';
import { registerPaths } from '../lib/swagger';
import {
  todoCreateSchema,
  todoDeleteSchema,
  todoGetSchema,
  todoSchema,
  todosGetSchema,
  todoUpdateSchema,
} from '../schemas/todos';
import CacheService from '../services/CacheService';
import TodoService from '../services/TodoService';

export const prefix = '/todos';

export default asRoute(async function todoRoute(router) {
  const cache = await caching(
    // check compatible stores at https://www.npmjs.com/package/cache-manager#store-engines
    // or implement your own
    memoryStore({ ttl: 0 }),
  );
  const cacheService = new CacheService(cache);
  const todoService = new TodoService(cacheService);

  router

    .post(
      '/create',
      validate('body', todoCreateSchema),
      wrapper<{ RequestBody: FromSchema<typeof todoCreateSchema> }>(
        async function (request) {
          const { content } = request.body;
          const todo = await todoService.createTodo(content);
          return {
            todo,
          };
        },
      ),
    )

    .get(
      '/',
      validate('query', todosGetSchema),
      wrapper<{ RequestQuery: FromSchema<typeof todosGetSchema> }>(
        async function (request) {
          const query = request.query;
          const todos = await todoService.getTodos(query);
          return {
            todos,
          };
        },
      ),
    )

    .get(
      '/:id',
      validate('params', todoGetSchema),
      wrapper<{ RequestParams: FromSchema<typeof todoGetSchema> }>(
        async function (request) {
          const { id } = request.params;
          const todo = await todoService.getTodo(id);
          return {
            todo,
          };
        },
      ),
    )

    .patch(
      '/update',
      validate('body', todoUpdateSchema),
      wrapper<{ RequestBody: FromSchema<typeof todoUpdateSchema> }>(
        async function (request) {
          const { id, content, done } = request.body;
          const todo = await todoService.updateTodo(id, content, done);
          return {
            todo,
          };
        },
      ),
    )

    .delete(
      '/delete/:id',
      validate('params', todoDeleteSchema),
      wrapper<{ RequestParams: FromSchema<typeof todoDeleteSchema> }>(
        async function (request) {
          const { id } = request.params;
          const todo = await todoService.deleteTodo(id);
          return {
            todo,
          };
        },
      ),
    );

  /**
   * Paths
   */
  registerPaths({
    '/todos/create': {
      post: {
        description: 'create a todo',
        tags: ['todo'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: Object.assign(todoCreateSchema),
              example: {
                content: todoCreateSchema.properties.content.examples[0],
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'todo',
            content: {
              'application/json': {
                schema: Object.assign(
                  asJsonSchema({
                    type: 'object',
                    required: ['todo'],
                    properties: {
                      todo: todoSchema,
                    },
                  }),
                ),
              },
            },
          },
        },
      },
    },

    '/todos': {
      get: {
        description: 'get todos by query',
        tags: ['todo'],
        parameters: Object.keys(todosGetSchema.properties).map((key) => ({
          in: 'query',
          name: key,
          schema: Object.assign(todosGetSchema.properties)[key],
        })),
        responses: {
          '200': {
            description: 'todos',
            content: {
              'application/json': {
                schema: Object.assign(
                  asJsonSchema({
                    type: 'object',
                    required: ['todos'],
                    properties: {
                      todos: {
                        type: 'array',
                        items: todoSchema,
                      },
                    },
                  }),
                ),
              },
            },
          },
        },
      },
    },

    '/todos/{id}': {
      get: {
        description: 'get a todo',
        tags: ['todo'],
        parameters: Object.keys(todoGetSchema.properties).map((key) => ({
          in: 'path',
          name: key,
          required: Object.assign(todoGetSchema).required.includes(key),
          schema: Object.assign(todoGetSchema.properties)[key],
        })),
        responses: {
          '200': {
            description: 'todo',
            content: {
              'application/json': {
                schema: Object.assign(
                  asJsonSchema({
                    type: 'object',
                    required: ['todo'],
                    properties: {
                      todo: todoSchema,
                    },
                  }),
                ),
              },
            },
          },
        },
      },
    },

    '/todos/update': {
      patch: {
        description: 'update a todo',
        tags: ['todo'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: Object.assign(todoUpdateSchema),
            },
          },
        },
        responses: {
          '200': {
            description: 'todo',
            content: {
              'application/json': {
                schema: Object.assign(
                  asJsonSchema({
                    type: 'object',
                    required: ['todo'],
                    properties: {
                      todo: todoSchema,
                    },
                  }),
                ),
              },
            },
          },
        },
      },
    },

    '/todos/delete/{id}': {
      delete: {
        description: 'delete a todo',
        tags: ['todo'],
        parameters: Object.keys(todoDeleteSchema.properties).map((key) => ({
          in: 'path',
          name: key,
          required: Object.assign(todoDeleteSchema).required.includes(key),
          schema: todoDeleteSchema.properties,
        })),
        responses: {
          '200': {
            description: 'todo',
            content: {
              'application/json': {
                schema: Object.assign(
                  asJsonSchema({
                    type: 'object',
                    required: ['todo'],
                    properties: {
                      todo: todoSchema,
                    },
                  }),
                ),
              },
            },
          },
        },
      },
    },
  });
});
