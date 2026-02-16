import assert from 'node:assert/strict';
import test from 'node:test';
import { tools } from '../src/tools.js';
import { toolHandlers } from '../src/handlers.js';

test('every declared tool has a handler', () => {
  const missing = tools.map((t) => t.name).filter((name) => typeof toolHandlers[name] !== 'function');
  assert.deepEqual(missing, [], `Missing handlers for tools: ${missing.join(', ')}`);
});
