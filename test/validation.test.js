import assert from 'node:assert/strict';
import test from 'node:test';
import { toolHandlers } from '../src/handlers.js';
import * as httpWrapper from '../src/http-wrapper.js';
import fs from 'node:fs';
import { toolExamples } from './helpers/fixtures.js';

test('move_set_target validates joint limits', async () => {
  const bad = { head_pitch: 100 }; // out of range
  await assert.rejects(async () => toolHandlers.move_set_target(bad));
});

test('play_move rejects invalid dataset', async () => {
  await assert.rejects(async () => toolHandlers.play_move({ dataset: 'bad-dataset', move: 'x' }));
});

test('startup_reachy and shutdown_reachy are exposed functions', () => {
  assert.equal(typeof toolHandlers.startup_reachy, 'function');
  assert.equal(typeof toolHandlers.shutdown_reachy, 'function');
});

// Ensure tests never call real network: stub the http wrapper to always reject.
httpWrapper.http.request = () => Promise.reject(new Error('network disabled in tests'));

test('handlers respond correctly with mocked http', async () => {
  // provide a mock that returns predictable responses
  httpWrapper.http.request = (path, method, body, query) => {
    return Promise.resolve({ status: 200, data: { path, method, body, query } });
  };

  // call a few handlers that use http and assert shape
  const s = await toolHandlers.reachy_status();
  assert.ok(s.content && s.content[0].text);

  const start = await toolHandlers.startup_reachy({ wake_up: false });
  assert.ok(start.content && start.content[0].text.includes('job_id') || start.content[0].text.includes('status'));

  const stop = await toolHandlers.shutdown_reachy({ goto_sleep: false });
  assert.ok(stop.content && stop.content[0].text);
});

test('handlers handle HTTP errors gracefully', async () => {
  // mock http.request to return a 500-like response
  httpWrapper.http.request = () => Promise.resolve({ status: 500, data: { error: 'server' } });

  const res = await toolHandlers.reachy_status();
  // handler returns content even on HTTP 500; ensure stringified content exists
  assert.ok(res.content && res.content[0].text);

  // Restore to rejecting network disabled state
  httpWrapper.http.request = () => Promise.reject(new Error('network disabled in tests'));
});

test('handlers recovery from timeout / malformed responses', async () => {
  // Simulate malformed JSON from http layer by rejecting with a parsing error
  httpWrapper.http.request = () => Promise.reject(new Error('Invalid JSON response'));

  // Handlers should surface an Error response rather than crash the test runner
  await assert.rejects(async () => toolHandlers.reachy_status());

  // Simulate a slow timeout by returning a rejected promise with timeout
  httpWrapper.http.request = () => Promise.reject(new Error('Request timeout'));
  await assert.rejects(async () => toolHandlers.startup_reachy());

  // Restore disabled network
  httpWrapper.http.request = () => Promise.reject(new Error('network disabled in tests'));
});

// Ensure no doc generation artifacts exist
test('no TOOLS.md or docs script', () => {
  assert.ok(!fs.existsSync('TOOLS.md'));
  assert.ok(!fs.existsSync('scripts/generate-docs.js'));
});
