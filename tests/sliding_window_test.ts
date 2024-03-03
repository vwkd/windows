import { Windows } from "../src/mod.ts";
import { assertEquals } from "../src/deps.ts";

Deno.test("non-wrapping, partial 2 1", () => {
  const array = [1, 2, 3, 4, 5];
  const windowSize = 3;
  const stepSize = 1;
  const buffer = new Windows(array, windowSize, stepSize);

  assertEquals(buffer.next(), { done: false, value: [1, 2, 3] });
  assertEquals(buffer.next(), { done: false, value: [2, 3, 4] });
  assertEquals(buffer.next(), { done: false, value: [3, 4, 5] });
  assertEquals(buffer.next(), { done: false, value: [4, 5] });
  assertEquals(buffer.next(), { done: false, value: [5] });
  assertEquals(buffer.next(), { done: true });
});

Deno.test("non-wrapping, partial 2 1, for..of", () => {
  const array = [1, 2, 3, 4, 5];
  const windowSize = 3;
  const stepSize = 1;
  const buffer = new Windows(array, windowSize, stepSize);

  const results = [];
  for (const value of buffer) {
    results.push(value);
  }

  assertEquals(results, [[1, 2, 3], [2, 3, 4], [3, 4, 5], [4, 5], [5]]);
});

Deno.test("wrapping", () => {
  const array = [1, 2, 3, 4, 5];
  const windowSize = 3;
  const stepSize = 1;
  const buffer = new Windows(array, windowSize, stepSize, true);

  assertEquals(buffer.next(), { done: false, value: [1, 2, 3] });
  assertEquals(buffer.next(), { done: false, value: [2, 3, 4] });
  assertEquals(buffer.next(), { done: false, value: [3, 4, 5] });
  assertEquals(buffer.next(), { done: false, value: [4, 5, 1] });
  assertEquals(buffer.next(), { done: false, value: [5, 1, 2] });
  assertEquals(buffer.next(), { done: false, value: [1, 2, 3] });
});

Deno.test("wrapping, for..of", () => {
  const array = [1, 2, 3, 4, 5];
  const windowSize = 3;
  const stepSize = 1;
  const buffer = new Windows(array, windowSize, stepSize, true);

  const results = [];
  for (const value of buffer) {
    results.push(value);

    if (results.length >= 6) {
      break;
    }
  }

  assertEquals(results, [
    [1, 2, 3],
    [2, 3, 4],
    [3, 4, 5],
    [4, 5, 1],
    [5, 1, 2],
    [1, 2, 3],
  ]);
});
