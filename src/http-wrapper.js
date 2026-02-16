import { httpRequest } from './http.js';

// Mutable wrapper so tests can swap `http.request` to a mock implementation.
export const http = {
  request: (...args) => httpRequest(...args),
};
