import { z } from "zod";

/**
 * Window over an iterable
 */
export class Windows<T>
  implements Iterator<T[], undefined, undefined>, Iterable<T[]> {
  /**
   * Iterator to create window over
   */
  #iterator: Iterator<T>;
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
   * Buffer to cache elements of iterator
   */
  #buffer: T[] = [];
  /**
   * Flag if iterator is done
   */
  #done: boolean = false;
  /**
   * Current window start index
   */
  #cursor: number;

  /**
   * Create a window over an iterable
   *
   * - sliding window if step size is `1`
   * - tumbling window if step size is window size
   * - hopping window if in between
   * - note: if wraps around, never "finishes", indefinitely
   * - note: if doesn't wrap around, the last window may be smaller than window size
   *
   * @param iterable iterable to create window over
   * @param windowSize window size, greater or equal to `1`
   * @param stepSize step size, greater or equal to `1`, smaller or equal to window size
   * @param wrap wrap around, defaults to `false`
   */
  constructor(
    iterable: Iterable<T>,
    windowSize: number,
    stepSize: number,
    wrap = false,
  ) {
    // todo: how to validate `iterable`?

    const windowSizeSchema = z
      .number()
      .int()
      .min(1);
    windowSizeSchema.parse(windowSize);

    const stepSizeSchema = z
      .number()
      .int()
      .min(1)
      .max(windowSize);
    stepSizeSchema.parse(stepSize);

    const wrapSchema = z.boolean();
    wrapSchema.parse(wrap);

    this.#iterator = iterable[Symbol.iterator]();
    this.#windowSize = windowSize;
    this.#stepSize = stepSize;
    this.#wrap = wrap;
    this.#buffer = [];
    this.#done = false;
    this.#cursor = 0;
  }

  /**
   * Get next window
   *
   * - note: if wraps around, never returns `{ done: true }`, indefinitely
   * - note: if doesn't wrap around, last window may be smaller than window size
   * @returns array with next elements
   */
  next(): IteratorResult<T[], undefined> {
    const window: T[] = [];

    if (this.#wrap) {
      for (let i = 0; i < this.#windowSize; i += 1) {
        const indexMaybe = this.#cursor + i;

        if (indexMaybe >= this.#buffer.length && !this.#done) {
          const { value, done } = this.#iterator.next();

          if (done) {
            this.#done = true;
          } else {
            this.#buffer.push(value);
          }
        }

        // note: is `indexMaybe` as long as iterator is not done, since buffer length is maintained one larger by previous `if` statement
        const index = indexMaybe % this.#buffer.length;
        window.push(this.#buffer[index]);
      }

      const cursorMaybe = this.#cursor + this.#stepSize;
      // note: `cursorMaybe` can be buffer length as long as iterator is not done, since buffer length is maintained equal to cursor plus window size by previous `for` loop containing `if` statement and step size can be equal to window size
      this.#cursor = this.#done
        ? cursorMaybe % this.#buffer.length
        : cursorMaybe;
    } else {
      // note: is false as long as iterator is not done, since buffer length is maintained one larger than window size by previous call's `for` loop containing `if` statement, and step size is always smaller or equal to window size
      // todo: maybe only let cursor > 0 instead of this.#done?
      if (this.#cursor >= this.#buffer.length && this.#done) {
        return { done: true, value: undefined };
      }

      for (let i = 0; i < this.#windowSize; i += 1) {
        const index = this.#cursor + i;

        if (index >= this.#buffer.length) {
          if (this.#done) {
            break;
          }

          const { value, done } = this.#iterator.next();

          if (done) {
            this.#done = true;

            if (!window.length) {
              return { done: true, value: undefined };
            }

            break;
          } else {
            this.#buffer.push(value);
          }
        }

        window.push(this.#buffer[index]);
      }

      this.#cursor = this.#cursor + this.#stepSize;
    }

    return { done: false, value: window };
  }

  [Symbol.iterator](): this {
    return this;
  }
}
