import { Windows } from "../src/mod.ts";
import { assertEquals } from "../src/deps.ts";

Deno.test("non-wrapping, partial 1", () => {
  const array = [1, 2, 3, 4, 5];
  const windowSize = 3;
  const stepSize = 2;
  const buffer = new Windows(array, windowSize, stepSize);

  assertEquals(buffer.next(), { done: false, value: [1, 2, 3] });
  assertEquals(buffer.next(), { done: false, value: [3, 4, 5] });
  assertEquals(buffer.next(), { done: false, value: [5] });
  assertEquals(buffer.next(), { done: true });
});

Deno.test("non-wrapping, partial 1, for..of", () => {
  const array = [1, 2, 3, 4, 5];
  const windowSize = 3;
  const stepSize = 2;
  const buffer = new Windows(array, windowSize, stepSize);

  const results = [];
  for (const value of buffer) {
    results.push(value);
  }

  assertEquals(results, [[1, 2, 3], [3, 4, 5], [5]]);
});

Deno.test("non-wrapping, partial 2", () => {
  const array = [1, 2, 3, 4, 5, 6];
  const windowSize = 3;
  const stepSize = 2;
  const buffer = new Windows(array, windowSize, stepSize);

  assertEquals(buffer.next(), { done: false, value: [1, 2, 3] });
  assertEquals(buffer.next(), { done: false, value: [3, 4, 5] });
  assertEquals(buffer.next(), { done: false, value: [5, 6] });
  assertEquals(buffer.next(), { done: true });
});

Deno.test("non-wrapping, partial 2, for..of", () => {
  const array = [1, 2, 3, 4, 5, 6];
  const windowSize = 3;
  const stepSize = 2;
  const buffer = new Windows(array, windowSize, stepSize);

  const results = [];
  for (const value of buffer) {
    results.push(value);
  }

  assertEquals(results, [[1, 2, 3], [3, 4, 5], [5, 6]]);
});
