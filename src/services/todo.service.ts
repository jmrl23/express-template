import type { Store } from 'cache-manager';
import CacheService from './cache.service';
import crypto from 'node:crypto';
import { NotFound } from 'http-errors';

export default class TodoService {
  private constructor(private readonly cacheService: CacheService) {}

  public static async createInstance(
    store?: Store | Promise<Store>,
  ): Promise<TodoService> {
    const cacheService = await CacheService.createInstance(store);
    const instance = new TodoService(cacheService);
    return instance;
  }

  public async createTodo(content: string): Promise<Todo> {
    const id = crypto.randomUUID();
    const now = new Date();
    const todo: Todo = {
      id,
      createdAt: now,
      updatedAt: now,
      content,
      done: false,
    };
    await this.cacheService.set(`todo:${id}`, todo);
    return todo;
  }

  public async getTodos(): Promise<Todo[]> {
    const store = this.cacheService.cache.store;
    const keys = await store.keys();
    const todoKeys = keys.filter((key) => key.startsWith('todo:'));
    const todos = await Promise.all(
      todoKeys.map((key) => this.cacheService.get<Todo>(key) as Promise<Todo>),
    );
    return todos;
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
    todo.updatedAt = new Date();
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

interface Todo {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  content: string;
  done: boolean;
}
