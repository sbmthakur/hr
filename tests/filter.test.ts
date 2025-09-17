import test from "node:test";
import assert from "assert";

import { filterEntries } from "../filter";
import { HarEntry } from "../types";

const fixtures: HarEntry[] = [
  {
    request: {
      url: "https://api.example.com/users",
      method: "GET",
    },
    response: {
      status: 200,
    },
  },
  {
    request: {
      url: "https://api.example.com/users",
      method: "POST",
    },
    response: {
      status: 201,
    },
  },
  {
    request: {
      url: "https://cdn.example.com/assets/logo.png",
      method: "GET",
    },
    response: {
      status: 304,
    },
  },
];

test("filters by URL substring", () => {
  const results = filterEntries(fixtures, "cdn");
  assert.strictEqual(results.length, 1);
  assert.strictEqual(results[0].request.url, fixtures[2].request.url);
});

test("filters by HTTP method", () => {
  const results = filterEntries(fixtures, "post");
  assert.strictEqual(results.length, 1);
  assert.strictEqual(results[0].request.method, "POST");
});

test("filters by status code", () => {
  const results = filterEntries(fixtures, "200");
  assert.strictEqual(results.length, 1);
  assert.strictEqual(results[0].response.status, 200);
});

test("returns all entries when query is empty", () => {
  const results = filterEntries(fixtures, "   ");
  assert.strictEqual(results.length, fixtures.length);
});
