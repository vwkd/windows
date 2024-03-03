import { Windows } from "../src/mod.ts";
import { assertEquals } from "../src/deps.ts";

Deno.test("non-wrapping, no partial", () => {
  const array = [1, 2, 3, 4, 5, 6];
  const windowSize = 3;
  const stepSize = 3;
  const buffer = new Windows(array, windowSize, stepSize);

  assertEquals(buffer.next(), { done: false, value: [1, 2, 3] });
  assertEquals(buffer.next(), { done: false, value: [4, 5, 6] });
  assertEquals(buffer.next(), { done: true });
});

Deno.test("non-wrapping, no partial, for..of", () => {
  const array = [1, 2, 3, 4, 5, 6];
  const windowSize = 3;
  const stepSize = 3;
  const buffer = new Windows(array, windowSize, stepSize);

  const results = [];
  for (const value of buffer) {
    results.push(value);
  }

  assertEquals(results, [[1, 2, 3], [4, 5, 6]]);
});

Deno.test("non-wrapping, partial 1", () => {
  const array = [1, 2, 3, 4, 5, 6, 7];
  const windowSize = 3;
  const stepSize = 3;
  const buffer = new Windows(array, windowSize, stepSize);

  assertEquals(buffer.next(), { done: false, value: [1, 2, 3] });
  assertEquals(buffer.next(), { done: false, value: [4, 5, 6] });
  assertEquals(buffer.next(), { done: false, value: [7] });
  assertEquals(buffer.next(), { done: true });
});

Deno.test("non-wrapping, partial 1, for..of", () => {
  const array = [1, 2, 3, 4, 5, 6, 7];
  const windowSize = 3;
  const stepSize = 3;
  const buffer = new Windows(array, windowSize, stepSize);

  const results = [];
  for (const value of buffer) {
    results.push(value);
  }

  assertEquals(results, [[1, 2, 3], [4, 5, 6], [7]]);
});

Deno.test("non-wrapping, partial 2", () => {
  const array = [1, 2, 3, 4, 5, 6, 7, 8];
  const windowSize = 3;
  const stepSize = 3;
  const buffer = new Windows(array, windowSize, stepSize);

  assertEquals(buffer.next(), { done: false, value: [1, 2, 3] });
  assertEquals(buffer.next(), { done: false, value: [4, 5, 6] });
  assertEquals(buffer.next(), { done: false, value: [7, 8] });
  assertEquals(buffer.next(), { done: true });
});

Deno.test("non-wrapping, partial 2, for..of", () => {
  const array = [1, 2, 3, 4, 5, 6, 7, 8];
  const windowSize = 3;
  const stepSize = 3;
  const buffer = new Windows(array, windowSize, stepSize);

  const results = [];
  for (const value of buffer) {
    results.push(value);
  }

  assertEquals(results, [[1, 2, 3], [4, 5, 6], [7, 8]]);
});

Deno.test("wrapping, no partial", () => {
  const array = [1, 2, 3, 4, 5, 6];
  const windowSize = 3;
  const stepSize = 3;
  const buffer = new Windows(array, windowSize, stepSize, true);

  assertEquals(buffer.next(), { done: false, value: [1, 2, 3] });
  assertEquals(buffer.next(), { done: false, value: [4, 5, 6] });
  assertEquals(buffer.next(), { done: false, value: [1, 2, 3] });
});

Deno.test("wrapping, no partial, for..of", () => {
  const array = [1, 2, 3, 4, 5, 6];
  const windowSize = 3;
  const stepSize = 3;
  const buffer = new Windows(array, windowSize, stepSize, true);

  const results = [];
  for (const value of buffer) {
    results.push(value);

    if (results.length >= 3) {
      break;
    }
  }

  assertEquals(results, [[1, 2, 3], [4, 5, 6], [1, 2, 3]]);
});

Deno.test("wrapping, partial", () => {
  const array = [1, 2, 3, 4, 5, 6, 7];
  const windowSize = 3;
  const stepSize = 3;
  const buffer = new Windows(array, windowSize, stepSize, true);

  assertEquals(buffer.next(), { done: false, value: [1, 2, 3] });
  assertEquals(buffer.next(), { done: false, value: [4, 5, 6] });
  assertEquals(buffer.next(), { done: false, value: [7, 1, 2] });
  assertEquals(buffer.next(), { done: false, value: [3, 4, 5] });
  assertEquals(buffer.next(), { done: false, value: [6, 7, 1] });
  assertEquals(buffer.next(), { done: false, value: [2, 3, 4] });
  assertEquals(buffer.next(), { done: false, value: [5, 6, 7] });
  assertEquals(buffer.next(), { done: false, value: [1, 2, 3] });
});

Deno.test("wrapping, partial, for..of", () => {
  const array = [1, 2, 3, 4, 5, 6, 7];
  const windowSize = 3;
  const stepSize = 3;
  const buffer = new Windows(array, windowSize, stepSize, true);

  const results = [];
  for (const value of buffer) {
    results.push(value);

    if (results.length >= 8) {
      break;
    }
  }

  assertEquals(results, [
    [1, 2, 3],
    [4, 5, 6],
    [7, 1, 2],
    [3, 4, 5],
    [6, 7, 1],
    [2, 3, 4],
    [5, 6, 7],
    [1, 2, 3],
  ]);
});
