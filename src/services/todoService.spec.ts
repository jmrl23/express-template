import { caching } from 'cache-manager';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import CacheService from './CacheService';
import TodoService, { Todo } from './TodoService';

describe('test todo service', async function testTodoService() {
  const cache = await caching('memory');
  const cacheService = new CacheService(cache);
  const todoService = new TodoService(cacheService);
  let itemRef: Todo;

  it('create item', async () => {
    const item = await todoService.createTodo('Walk the dog');
    assert.ok(item);
    itemRef = structuredClone(item);
  });

  it('get item', async () => {
    await assert.rejects(todoService.getTodo('invalid id'));
    const item = await todoService.getTodo(itemRef.id);
    assert.deepStrictEqual(itemRef, item);
  });

  it('get items', async () => {
    const items = await todoService.getTodos();
    assert.strictEqual(items.length, 1);
  });

  it('update item', async () => {
    const content = 'Walk the cat';
    const item = await todoService.updateTodo(itemRef.id, content);
    assert.strictEqual(item.content, content);
  });

  it('delete item', async () => {
    const id = itemRef.id;
    const item = await todoService.deleteTodo(id);
    assert.strictEqual(item.id, id);
    await assert.rejects(todoService.deleteTodo(id));
  });
});
