import { caching } from 'cache-manager';
import type { FromSchema } from 'json-schema-to-ts';
import crypto from 'node:crypto';
import { addSpecPaths } from '../lib/docs';
import validate, { PROP } from '../lib/util/express/validate';
import wrapper from '../lib/util/express/wrapper';
import { asRoute } from '../lib/util/typings';
import {
  todoCreateSchema,
  todoDeleteSchema,
  todoGetAllSchema,
  todoGetSchema,
  todoUpdateSchema,
} from '../schemas/todo.schema';
import CacheService from '../services/cache.service';
import TodoService from '../services/todo.service';

export const prefix = '/todo';

export default asRoute(async function (app) {
  const cache = await caching('memory');
  const cacheService = new CacheService(cache);
  const todoService = new TodoService(cacheService);

  app

    .post(
      '/create',
      validate(PROP.Body, todoCreateSchema),
      wrapper<FromSchema<typeof todoCreateSchema>>(async function (request) {
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
      validate(PROP.Params, todoGetSchema),
      wrapper<unknown, FromSchema<typeof todoGetSchema>>(
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
      validate(PROP.Body, todoUpdateSchema),
      wrapper<FromSchema<typeof todoUpdateSchema>>(async function (request) {
        const { id, content, done } = request.body;
        const todo = await todoService.updateTodo(id, content, done);
        return {
          todo,
        };
      }),
    )

    .delete(
      '/delete/:id',
      validate(PROP.Params, todoDeleteSchema),
      wrapper<unknown, FromSchema<typeof todoDeleteSchema>>(
        async function (request) {
          const { id } = request.params;
          const todo = await todoService.deleteTodo(id);
          return {
            todo,
          };
        },
      ),
    );
});

// Docs
void addSpecPaths({
  '/todo/create': {
    post: {
      description: todoCreateSchema.description,
      tags: ['todo'],
      security: [],
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
          description: 'Default Response',
        },
      },
    },
  },

  '/todo': {
    get: {
      description: todoGetAllSchema.description,
      tags: ['todo'],
      security: [],
      responses: {
        '200': {
          description: 'Default Response',
        },
      },
    },
  },

  '/todo/{id}': {
    get: {
      description: todoGetSchema.description,
      tags: ['todo'],
      security: [],
      parameters: Object.keys(todoGetSchema.properties).map((key) => ({
        in: 'path',
        name: key,
        required: Object.assign(todoGetSchema).required.includes(key),
        schema: todoGetSchema.properties,
      })),
      responses: {
        '200': {
          description: 'Default Response',
        },
      },
    },
  },

  '/todo/update': {
    patch: {
      description: todoUpdateSchema.description,
      tags: ['todo'],
      security: [],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: Object.assign(todoUpdateSchema),
            example: {
              id: crypto.randomUUID(),
              content: todoUpdateSchema.properties.content.examples[0],
              done: todoUpdateSchema.properties.done.examples[0],
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Default Response',
        },
      },
    },
  },

  '/todo/delete/{id}': {
    delete: {
      description: todoDeleteSchema.description,
      tags: ['todo'],
      security: [],
      parameters: Object.keys(todoDeleteSchema.properties).map((key) => ({
        in: 'path',
        name: key,
        required: Object.assign(todoDeleteSchema).required.includes(key),
        schema: todoDeleteSchema.properties,
      })),
      responses: {
        '200': {
          description: 'Default Response',
        },
      },
    },
  },
});
