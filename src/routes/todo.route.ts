import { memoryStore } from 'cache-manager';
import { asRoute } from '../lib/util/typings';
import TodoService from '../services/todo.service';
import validate, { PROP } from '../lib/util/express/validate';
import {
  todoCreateSchema,
  todoDeleteSchema,
  todoGetSchema,
  todoUpdateSchema,
} from '../schemas/todo.schema';
import wrapper from '../lib/util/express/wrapper';
import type { FromSchema } from 'json-schema-to-ts';

export const prefix = '/todo';

export default asRoute(async function (app) {
  const store = memoryStore({ ttl: 0 });
  const todoService = await TodoService.createInstance(store);

  app

    /**
     * @openapi
     *
     * /todo/create:
     *  post:
     *    description: Create new todo item
     *    tags:
     *      - todo
     *    security: []
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            type: object
     *            required:
     *              - content
     *            properties:
     *              content:
     *                type: string
     *                minLength: 1
     *                example: Walk the dog
     *    responses:
     *      200:
     *        description: Default Response
     */

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

    /**
     * @openapi
     *
     * /todo:
     *  get:
     *    description: Get todo items
     *    tags:
     *      - todo
     *    security: []
     *    responses:
     *      200:
     *        description: Default Response
     */

    .get(
      '/',
      wrapper(async function () {
        const todos = await todoService.getTodos();
        return {
          todos,
        };
      }),
    )

    /**
     * @openapi
     *
     * /todo/{id}:
     *  get:
     *    description: Get todo item
     *    tags:
     *      - todo
     *    security: []
     *    parameters:
     *      - in: path
     *        name: id
     *        required: true
     *        type: string
     *        format: uuid
     *    responses:
     *      200:
     *        description: Default Response
     */

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

    /**
     * @openapi
     *
     * /todo/update:
     *  patch:
     *    description: Update todo item
     *    tags:
     *      - todo
     *    security: []
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            type: object
     *            required:
     *              - id
     *            properties:
     *              id:
     *                type: string
     *                format: uuid
     *              content:
     *                type: string
     *                minLength: 1
     *                example: Walk the dog
     *              done:
     *                type: boolean
     *                example: false
     *    responses:
     *      200:
     *        description: Default Response
     */

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

    /**
     * @openapi
     *
     * /todo/delete/{id}:
     *  delete:
     *    description: Delete todo item
     *    tags:
     *      - todo
     *    security: []
     *    parameters:
     *      - in: path
     *        name: id
     *        required: true
     *        type: string
     *        format: uuid
     *    responses:
     *      200:
     *        description: Default Response
     */

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
