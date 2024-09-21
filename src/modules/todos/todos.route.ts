import { caching, memoryStore } from 'cache-manager';
import { FromSchema } from 'json-schema-to-ts';
import {
  asJsonSchema,
  asRoute,
  validate,
  WPayload,
  wrapper,
} from '../../lib/common';
import {
  todoCreateSchema,
  todoDeleteSchema,
  todoGetSchema,
  todoSchema,
  todosGetSchema,
  todoUpdateSchema,
} from './todosSchema';
import { CacheService } from '../cache/cacheService';
import { TodosService } from './todosService';

export const prefix = '/todos';

export default asRoute(async function (router, express) {
  const cache = await caching(
    // check compatible stores at https://www.npmjs.com/package/cache-manager#store-engines
    // or implement your own
    memoryStore({ ttl: 0 }),
  );
  const cacheService = new CacheService(cache);
  const todosService = new TodosService(cacheService);

  router

    .post(
      '/create',
      validate('body', todoCreateSchema),
      wrapper<
        WPayload<{
          RequestBody: FromSchema<typeof todoCreateSchema>;
        }>
      >(async function (request) {
        const { content } = request.body;
        const todo = await todosService.createTodo(content);
        return {
          data: todo,
        };
      }),
    )

    .get(
      '/',
      validate('query', todosGetSchema),
      wrapper<
        WPayload<{
          RequestQuery: FromSchema<typeof todosGetSchema>;
        }>
      >(async function (request) {
        const query = request.query;
        const todos = await todosService.getTodos(query);
        return {
          data: todos,
        };
      }),
    )

    .get(
      '/:id',
      validate('params', todoGetSchema),
      wrapper<
        WPayload<{
          RequestParams: FromSchema<typeof todoGetSchema>;
        }>
      >(async function (request) {
        const { id } = request.params;
        const todo = await todosService.getTodo(id);
        return {
          data: todo,
        };
      }),
    )

    .patch(
      '/update/:id',
      validate('params', todoUpdateSchema.properties.params),
      validate('body', todoUpdateSchema.properties.body),
      wrapper<
        WPayload<{
          RequestParams: FromSchema<typeof todoUpdateSchema.properties.params>;
          RequestBody: FromSchema<typeof todoUpdateSchema.properties.body>;
        }>
      >(async function (request) {
        const id = request.params.id;
        const { content, done } = request.body;
        const todo = await todosService.updateTodo(id, content, done);
        return {
          data: todo,
        };
      }),
    )

    .delete(
      '/delete/:id',
      validate('params', todoDeleteSchema),
      wrapper<
        WPayload<{
          RequestParams: FromSchema<typeof todoDeleteSchema>;
        }>
      >(async function (request) {
        const { id } = request.params;
        const todo = await todosService.deleteTodo(id);
        return {
          data: todo,
        };
      }),
    );

  /**
   * Documents API endpoints using Swagger/OpenAPI. (Optional)
   * It defines routes, request details, and responses, helping to generate clear and useful API documentation.
   *
   * Note: To disable API endpoints documentation, unregister (remove) the `docsPlugin` inside the bootstrap file.
   */
  express.docsService.paths({
    '/todos/create': {
      post: {
        description: 'create a todo',
        tags: ['todo'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: express.docsService.schema(todoCreateSchema),
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
                schema: express.docsService.schema(
                  asJsonSchema({
                    type: 'object',
                    required: ['data'],
                    properties: {
                      data: todoSchema,
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
        parameters: express.docsService.parameters('query', todosGetSchema),
        responses: {
          '200': {
            description: 'todos',
            content: {
              'application/json': {
                schema: express.docsService.schema(
                  asJsonSchema({
                    type: 'object',
                    required: ['data'],
                    properties: {
                      data: {
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
        parameters: express.docsService.parameters('path', todoGetSchema),
        responses: {
          '200': {
            description: 'todo',
            content: {
              'application/json': {
                schema: express.docsService.schema(
                  asJsonSchema({
                    type: 'object',
                    required: ['data'],
                    properties: {
                      data: todoSchema,
                    },
                  }),
                ),
              },
            },
          },
        },
      },
    },

    '/todos/update/{id}': {
      patch: {
        description: 'update a todo',
        tags: ['todo'],
        parameters: express.docsService.parameters(
          'path',
          todoUpdateSchema.properties.params,
        ),
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: express.docsService.schema(
                todoUpdateSchema.properties.body,
              ),
            },
          },
        },
        responses: {
          '200': {
            description: 'todo',
            content: {
              'application/json': {
                schema: express.docsService.schema(
                  asJsonSchema({
                    type: 'object',
                    required: ['data'],
                    properties: {
                      data: todoSchema,
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
        parameters: express.docsService.parameters('path', todoDeleteSchema),
        responses: {
          '200': {
            description: 'todo',
            content: {
              'application/json': {
                schema: express.docsService.schema(
                  asJsonSchema({
                    type: 'object',
                    required: ['data'],
                    properties: {
                      data: todoSchema,
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
