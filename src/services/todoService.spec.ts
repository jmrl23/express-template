import { caching } from 'cache-manager';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { Todo } from '../schemas/todos';
import CacheService from './CacheService';
import TodoService from './TodoService';

describe('test todo service', async function testTodoService() {
  const cache = await caching('memory');
  const cacheService = new CacheService(cache);
  const todoService = new TodoService(cacheService);
  let todoRef: Todo | undefined;

  it('create todo', async () => {
    const todo = await todoService.createTodo('Walk the dog');
    assert.ok(todo);
    todoRef = todo;
  });

  it('get all todo', async () => {
    const todos = await todoService.getTodos();
    assert.strictEqual(todos.length, 1);
  });

  it('get a todo', async () => {
    assert.rejects(todoService.getTodo('invalid id'));
    const todo = await todoService.getTodo(todoRef!.id);
    assert.deepStrictEqual(todoRef, todo);
  });

  it('update a todo', async () => {
    const content = 'Walk the cat';
    const todo = await todoService.updateTodo(todoRef!.id, content);
    assert.strictEqual(todo.content, content);
  });

  it('delete a todo', async () => {
    const id = todoRef!.id;
    const todo = await todoService.deleteTodo(id);
    assert.strictEqual(todo.id, id);
    assert.rejects(todoService.deleteTodo(id));
  });
});
