import { z } from "./deps.ts";

/**
 * Window over an array
 */
export class Windows<T> {
  /**
   * Array to create window over
   */
  #array: T[];
  /**
   * Window size
   */
  #windowSize: number;
  /**
   * Step size
   *
   * - sliding window if step size is `1`
   * - tumbling window if step size is window size
   * - hopping window if in between
   */
  #stepSize: number;
  /**
   * Wrap around
   */
  #wrap: boolean;
  /**
   * Current window start index
   */
  #cursor: number;

  /**
   * Create a window over an array
   *
   * - sliding window if step size is `1`
   * - tumbling window if step size is window size
   * - hopping window if in between
   * - note: if wraps around, never "finishes", indefinitely
   * - note: if doesn't wrap around, the last window may be smaller than window size
   *
   * @param array array to create window over
   * @param windowSize window size, greater or equal to `1`, smaller or equal to array length
   * @param stepSize step size, greater or equal to `1`, smaller or equal to window size
   * @param wrap wrap around, defaults to `false`
   */
  constructor(array: T[], windowSize: number, stepSize: number, wrap = false) {
    const arraySchema = z.array(z.unknown());
    arraySchema.parse(array);

    const windowSizeSchema = z
      .number()
      .int()
      .min(1)
      .max(array.length);
    windowSizeSchema.parse(windowSize);

    const stepSizeSchema = z
      .number()
      .int()
      .min(1)
      .max(windowSize);
    stepSizeSchema.parse(stepSize);

    const wrapSchema = z.boolean();
    wrapSchema.parse(wrap);

    this.#array = array;
    this.#windowSize = windowSize;
    this.#stepSize = stepSize;
    this.#wrap = wrap;
    this.#cursor = 0;
  }

  /**
   * Get next window
   *
   * - note: if wraps around, never returns `{ done: true }`, indefinitely
   * - note: if doesn't wrap around, last window may be smaller than window size
   * @returns array with next elements
   */
  next() {
    const window: T[] = [];

    if (this.#wrap) {
      for (let i = 0; i < this.#windowSize; i += 1) {
        const index = (this.#cursor + i) % this.#array.length;
        window.push(this.#array[index]);
      }

      this.#cursor = (this.#cursor + this.#stepSize) % this.#array.length;
    } else {
      if (this.#cursor >= this.#array.length) {
        return { done: true };
      }

      for (let i = 0; i < this.#windowSize; i += 1) {
        const index = this.#cursor + i;

        if (index >= this.#array.length) {
          break;
        }

        window.push(this.#array[index]);
      }

      this.#cursor = this.#cursor + this.#stepSize;
    }

    return { done: false, value: window };
  }

  [Symbol.iterator]() {
    return this;
  }
}
