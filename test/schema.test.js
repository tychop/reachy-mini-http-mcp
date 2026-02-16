import test from 'node:test';
import assert from 'node:assert/strict';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { tools } from '../src/tools.js';
import { toolExamples, toolInvalidExamples } from './helpers/fixtures.js';

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

test('tool inputSchemas are valid JSON Schema and examples validate', () => {
  for (const t of tools) {
    if (!t.inputSchema) continue;
    // compile the schema to ensure it's valid
    const validate = ajv.compile(t.inputSchema);
    // basic check: required keys exist in schema if marked
    if (t.inputSchema.required && Array.isArray(t.inputSchema.required)) {
      for (const key of t.inputSchema.required) {
        assert.ok(
          t.inputSchema.properties && t.inputSchema.properties[key],
          `Tool ${t.name} marks '${key}' required but no property found`
        );
      }
    }
    // If schema defines enums for properties, ensure enums are non-empty
    if (t.inputSchema.properties) {
      for (const [k, prop] of Object.entries(t.inputSchema.properties)) {
        if (prop.enum) {
          assert.ok(Array.isArray(prop.enum) && prop.enum.length > 0, `Tool ${t.name} property ${k} has empty enum`);
        }
      }
    }
    // If test fixtures provide an example for this tool, validate it.
    const examples = toolExamples[t.name];
    if (examples !== undefined) {
      for (const example of examples) {
        const ok = validate(example);
        if (!ok) {
          throw new Error(`Example for tool ${t.name} does not validate: ${ajv.errorsText(validate.errors)}`);
        }
      }
    }

    // If invalid examples are provided, ensure the schema rejects them
    const bad = toolInvalidExamples[t.name];
    if (bad !== undefined) {
      for (const b of bad) {
        const ok = validate(b);
        if (ok) {
          throw new Error(`Invalid example for tool ${t.name} unexpectedly validated`);
        }
      }
    }
  }
});
