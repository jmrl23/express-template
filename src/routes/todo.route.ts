import { caching, memoryStore } from 'cache-manager';
import { addSpecPaths } from '../lib/swagger';
import { validate, wrapper } from '../lib/util/express';
import { asRoute } from '../lib/util/typings';
import {
  responseTodoOKSchema,
  responseTodosOKSchema,
  TodoCreate,
  todoCreateSchema,
  TodoDelete,
  todoDeleteSchema,
  TodoGet,
  todoGetAllSchema,
  todoGetSchema,
  TodoUpdate,
  todoUpdateSchema,
} from '../schemas/todo';
import CacheService from '../services/CacheService';
import TodoService from '../services/TodoService';

export const prefix = '/todo';

export default asRoute(async function todoRoute(app) {
  const cache = await caching(memoryStore({ ttl: 0 }));
  const cacheService = new CacheService(cache);
  const todoService = new TodoService(cacheService);

  app

    .post(
      '/create',
      validate('body', todoCreateSchema),
      wrapper<{ body: TodoCreate }>(async function (request) {
        const { content } = request.body;
        const todo = await todoService.createTodo(content);
        return {
          todo,
        };
      }),
    )

    .get(
      '',
      wrapper(async function () {
        const todos = await todoService.getTodos();
        return {
          todos,
        };
      }),
    )

    .get(
      '/:id',
      validate('params', todoGetSchema),
      wrapper<{ params: TodoGet }>(async function (request) {
        const { id } = request.params;
        const todo = await todoService.getTodo(id);
        return {
          todo,
        };
      }),
    )

    .patch(
      '/update',
      validate('body', todoUpdateSchema),
      wrapper<{ body: TodoUpdate }>(async function (request) {
        const { id, content, done } = request.body;
        const todo = await todoService.updateTodo(id, content, done);
        return {
          todo,
        };
      }),
    )

    .delete(
      '/delete/:id',
      validate('params', todoDeleteSchema),
      wrapper<{ params: TodoDelete }>(async function (request) {
        const { id } = request.params;
        const todo = await todoService.deleteTodo(id);
        return {
          todo,
        };
      }),
    );
});

// Docs
void addSpecPaths({
  '/todo/create': {
    post: {
      description: todoCreateSchema.description,
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
          description: responseTodoOKSchema.description,
          content: {
            'application/json': {
              schema: Object.assign(responseTodoOKSchema),
            },
          },
        },
      },
    },
  },

  '/todo': {
    get: {
      description: todoGetAllSchema.description,
      tags: ['todo'],
      responses: {
        '200': {
          description: responseTodosOKSchema.description,
          content: {
            'application/json': {
              schema: Object.assign(responseTodosOKSchema),
            },
          },
        },
      },
    },
  },

  '/todo/{id}': {
    get: {
      description: todoGetSchema.description,
      tags: ['todo'],
      parameters: Object.keys(todoGetSchema.properties).map((key) => ({
        in: 'path',
        name: key,
        required: Object.assign(todoGetSchema).required.includes(key),
        schema: todoGetSchema.properties,
      })),
      responses: {
        '200': {
          description: responseTodoOKSchema.description,
          content: {
            'application/json': {
              schema: Object.assign(responseTodoOKSchema),
            },
          },
        },
      },
    },
  },

  '/todo/update': {
    patch: {
      description: todoUpdateSchema.description,
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
          description: responseTodoOKSchema.description,
          content: {
            'application/json': {
              schema: Object.assign(responseTodoOKSchema),
            },
          },
        },
      },
    },
  },

  '/todo/delete/{id}': {
    delete: {
      description: todoDeleteSchema.description,
      tags: ['todo'],
      parameters: Object.keys(todoDeleteSchema.properties).map((key) => ({
        in: 'path',
        name: key,
        required: Object.assign(todoDeleteSchema).required.includes(key),
        schema: todoDeleteSchema.properties,
      })),
      responses: {
        '200': {
          description: responseTodoOKSchema.description,
          content: {
            'application/json': {
              schema: Object.assign(responseTodoOKSchema),
            },
          },
        },
      },
    },
  },
});
