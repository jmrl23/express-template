import { NotFound } from 'http-errors';
import { FromSchema } from 'json-schema-to-ts';
import crypto from 'node:crypto';
import { todoSchema, todosGetSchema } from './todosSchema';
import { CacheService } from '../cache/cacheService';

export interface Todo extends FromSchema<typeof todoSchema> {}

export class TodosService {
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
    await this.cacheService.set(`todo:${id}`, todo);
    return todo;
  }

  public async getTodos(
    query: FromSchema<typeof todosGetSchema> = {},
  ): Promise<Todo[]> {
    const cacheKey = `todos:[${JSON.stringify([query.content, query.done])}]`;

    if (query.revalidate === true) {
      await this.cacheService.del(cacheKey);
    }

    const cachedtodos = await this.cacheService.get<Todo[]>(cacheKey);
    if (cachedtodos) {
      return cachedtodos.slice(query.skip, query.take);
    }

    const store = this.cacheService.cache.store;
    const keys = await store.keys();
    const todoKeys = keys.filter((key) => key.startsWith('todo:'));
    const todos = await Promise.all(
      todoKeys.map((key) => this.cacheService.get<Todo>(key) as Promise<Todo>),
    );
    const filteredTodos = todos.filter((todo) => {
      return (
        (query.content === undefined
          ? true
          : todo.content.startsWith(query.content)) &&
        (query.done === undefined ? true : todo.done === query.done)
      );
    });
    await this.cacheService.set(
      cacheKey,
      structuredClone(filteredTodos),
      300 * 1000, // 5 mins.
    );
    return filteredTodos.slice(query.skip, query.take);
  }

  public async getTodo(id: string): Promise<Todo> {
    const todo = await this.cacheService.get<Todo>(`todo:${id}`);
    if (!todo) throw new NotFound('Todo not found');
    return todo;
  }

  public async updateTodo(
    id: string,
    content?: string,
    done?: boolean,
  ): Promise<Todo> {
    const todo = await this.cacheService.get<Todo>(`todo:${id}`);
    if (!todo) throw new NotFound('Todo not found');
    if (content !== undefined) todo.content = content;
    if (done !== undefined) todo.done = done;
    todo.updatedAt = new Date().toISOString();
    await this.cacheService.set(`todo:${id}`, todo);
    return todo;
  }

  public async deleteTodo(id: string): Promise<Todo> {
    const todo = await this.cacheService.get<Todo>(`todo:${id}`);
    if (!todo) throw new NotFound('Todo not found');
    await this.cacheService.del(`todo:${id}`);
    return todo;
  }
}
