import { memoryStore } from 'cache-manager';
import { asRoute } from '../lib/util/typings';
import TodoService from '../services/todo.service';
import validate, { PROP } from '../lib/util/express/validate';
import {
  todoCreateSchema,
  todoDeleteSchema,
  todoGetAllSchema,
  todoGetSchema,
  todoUpdateSchema,
} from '../schemas/todo.schema';
import { addSpecPaths } from '../lib/docs';
import wrapper from '../lib/util/express/wrapper';
import type { FromSchema } from 'json-schema-to-ts';

export const prefix = '/todo';

export default asRoute(async function (app) {
  const todoServiceCacheStore = memoryStore({ ttl: 0 });
  const todoService = await TodoService.createInstance(todoServiceCacheStore);

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
      '/',
      wrapper(async function () {
        const todos = await todoService.getTodos();
        return {
          todos,
        };
      }),
    )

    .get(
      '/:id',
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

/**
 * Docs
 */

addSpecPaths({
  '/todo/create': {
    post: {
      description: todoCreateSchema.description,
      tags: ['todo'],
      security: [],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: todoCreateSchema as Record<string, unknown>,
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
      parameters: [
        {
          in: 'params',
          name: 'id',
          required: todoGetSchema.required?.includes('id'),
          schema: todoGetSchema.properties.id,
        },
      ],
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
            schema: todoUpdateSchema as Record<string, unknown>,
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
    get: {
      description: todoDeleteSchema.description,
      tags: ['todo'],
      security: [],
      parameters: [
        {
          in: 'params',
          name: 'id',
          required: todoDeleteSchema.required?.includes('id'),
          schema: todoDeleteSchema.properties.id,
        },
      ],
      responses: {
        '200': {
          description: 'Default Response',
        },
      },
    },
  },
});
