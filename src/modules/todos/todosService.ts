import { NotFound } from 'http-errors';
import { FromSchema } from 'json-schema-to-ts';
import crypto from 'node:crypto';
import { todoSchema, todosGetSchema } from './todosSchema';
import { CacheService } from '../cache/cacheService';

export interface Todo extends FromSchema<typeof todoSchema> {}

/**
 * This is just an example, just imagine we're
 * using database for todos and we actually need caching
 */
export class TodosService {
  private readonly todos: Todo[] = [];

  constructor(private readonly cacheService: CacheService) {}

  public async createTodo(content: string): Promise<Todo> {
    const id = crypto.randomUUID();
    const now = new Date();
    const todo: Todo = {
      id,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      content,
      done: false,
    };
    this.todos.push(todo);
    await this.cacheService.set(
      `todo:[ref:id]:${id}`,
      structuredClone(todo),
      300 * 1000,
    );
    return todo;
  }

  public async getTodos(
    query: FromSchema<typeof todosGetSchema> = {},
  ): Promise<Todo[]> {
    const cacheKey = `todos:[ref:query]:(${JSON.stringify([query.content, query.done, query.skip, query.take])})`;

    if (query.revalidate === true) {
      await this.cacheService.del(cacheKey);
    }

    const cachedtodos = await this.cacheService.get<Todo[]>(cacheKey);
    if (cachedtodos) return cachedtodos;

    const todos = structuredClone(
      this.todos.filter((todo) => {
        let isIncluded = true;

        if (query.content !== undefined) {
          if (!todo.content.startsWith(query.content)) isIncluded = false;
        }

        if (!isIncluded) return false;

        if (query.done !== undefined) {
          if (todo.done !== query.done) isIncluded = false;
        }

        return isIncluded;
      }),
    ).slice(query.skip, query.take);

    await this.cacheService.set(
      cacheKey,
      todos,
      300 * 1000, // 5 mins.
    );

    return todos;
  }

  public async getTodo(id: string): Promise<Todo> {
    const cachedKey = `todo:[ref:id]:${id}`;
    const cachedTodo = await this.cacheService.get<Todo>(cachedKey);
    if (cachedTodo !== undefined) return cachedTodo;

    const todo = structuredClone(this.todos.find((todo) => todo.id === id));
    if (!todo) throw new NotFound('Todo not found');

    await this.cacheService.set(cachedKey, todo, 300 * 1000);
    return todo;
  }

  public async updateTodo(
    id: string,
    content?: string,
    done?: boolean,
  ): Promise<Todo> {
    const todo = this.todos.find((todo) => todo.id);
    if (!todo) throw new NotFound('Todo not found');

    if (content !== undefined) todo.content = content;
    if (done !== undefined) todo.done = done;

    const todoClone = structuredClone(todo);
    await this.cacheService.set(
      `todo:[ref:id]:${todo.id}`,
      todoClone,
      300 * 1000,
    );
    return todoClone;
  }

  public async deleteTodo(id: string): Promise<Todo> {
    const index = this.todos.findIndex((todo) => todo.id === id);
    if (index < 0) throw new NotFound('Todo not found');

    await this.cacheService.del(`todo:[ref:id]:${id}`);
    const todo = this.todos.splice(index, 1)[0];
    return todo;
  }
}
