import { caching } from 'cache-manager';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { CacheService } from '../cache/cacheService';
import { Todo, TodosService } from './todosService';

describe('test todo service', async function testTodoService() {
  const cache = await caching('memory');
  const cacheService = new CacheService(cache);
  const todosService = new TodosService(cacheService);
  let itemRef: Todo;

  it('create item', async () => {
    const item = await todosService.createTodo('Walk the dog');
    assert.ok(item);
    itemRef = structuredClone(item);
  });

  it('get item', async () => {
    await assert.rejects(todosService.getTodo('invalid id'));
    const item = await todosService.getTodo(itemRef.id);
    assert.deepStrictEqual(itemRef, item);
  });

  it('get items', async () => {
    const items = await todosService.getTodos();
    assert.strictEqual(items.length, 1);
  });

  it('update item', async () => {
    const content = 'Walk the cat';
    const item = await todosService.updateTodo(itemRef.id, content);
    assert.strictEqual(item.content, content);
  });

  it('delete item', async () => {
    const id = itemRef.id;
    const item = await todosService.deleteTodo(id);
    assert.strictEqual(item.id, id);
    await assert.rejects(todosService.deleteTodo(id));
  });
});
