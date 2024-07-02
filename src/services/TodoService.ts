import CacheService from './CacheService';
import crypto from 'node:crypto';
import { NotFound } from 'http-errors';
import type { TodoSchema } from '../schemas/todo';

export default class TodoService {
  constructor(private readonly cacheService: CacheService) {}

  public async createTodo(content: string): Promise<TodoSchema> {
    const id = crypto.randomUUID();
    const now = new Date();
    const todo: TodoSchema = {
      id,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      content,
      done: false,
    };
    await this.cacheService.set(`todo:${id}`, todo);
    return todo;
  }

  public async getTodos(): Promise<TodoSchema[]> {
    const store = this.cacheService.cache.store;
    const keys = await store.keys();
    const todoKeys = keys.filter((key) => key.startsWith('todo:'));
    const todos = await Promise.all(
      todoKeys.map(
        (key) => this.cacheService.get<TodoSchema>(key) as Promise<TodoSchema>,
      ),
    );
    return todos;
  }

  public async getTodo(id: string): Promise<TodoSchema> {
    const todo = await this.cacheService.get<TodoSchema>(`todo:${id}`);
    if (!todo) throw new NotFound('Todo not found');
    return todo;
  }

  public async updateTodo(
    id: string,
    content?: string,
    done?: boolean,
  ): Promise<TodoSchema> {
    const todo = await this.cacheService.get<TodoSchema>(`todo:${id}`);
    if (!todo) throw new NotFound('Todo not found');
    if (content !== undefined) todo.content = content;
    if (done !== undefined) todo.done = done;
    todo.updatedAt = new Date().toISOString();
    await this.cacheService.set(`todo:${id}`, todo);
    return todo;
  }

  public async deleteTodo(id: string): Promise<TodoSchema> {
    const todo = await this.cacheService.get<TodoSchema>(`todo:${id}`);
    if (!todo) throw new NotFound('Todo not found');
    await this.cacheService.del(`todo:${id}`);
    return todo;
  }
}
