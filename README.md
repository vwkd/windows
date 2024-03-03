# windows

Sliding, hopping, and tumbling windows over an iterable



## Features

- sliding, hopping, and tumbling windows
- non-wrapping or wrapping windows
- iterates iterable lazily
- is itself iterator, e.g. can use in `for..of`



## Usage

- sliding non-wrapping

```ts
import { Windows } from "./src/mod.ts";

const array = [1, 2, 3, 4, 5];
const windowSize = 3;
const stepSize = 1;
const buffer = new Windows(array, windowSize, stepSize);

for (const window of buffer) {
  console.log(window);
}
// [ 1, 2, 3 ]
// [ 2, 3, 4 ]
// [ 3, 4, 5 ]
// [ 4, 5 ]
// [ 5 ]
```

- sliding wrapping

```ts
import { Windows } from "./src/mod.ts";

const array = [1, 2, 3, 4, 5];
const windowSize = 3;
const stepSize = 1;
const buffer = new Windows(array, windowSize, stepSize, true);

for (let i = 0; i < 6; i += 1) {
  console.log(buffer.next().value);
}
// [ 1, 2, 3 ]
// [ 2, 3, 4 ]
// [ 3, 4, 5 ]
// [ 4, 5, 1 ]
// [ 5, 1, 2 ]
// [ 1, 2, 3 ]
// ...
```

- hopping non-wrapping

```ts
import { Windows } from "./src/mod.ts";

const array = [1, 2, 3, 4, 5];
const windowSize = 3;
const stepSize = 2;
const buffer = new Windows(array, windowSize, stepSize);

for (const window of buffer) {
  console.log(window);
}
// [ 1, 2, 3 ]
// [ 3, 4, 5 ]
// [ 5 ]
```

- hopping wrapping

```ts
import { Windows } from "./src/mod.ts";

const array = [1, 2, 3, 4, 5];
const windowSize = 3;
const stepSize = 2;
const buffer = new Windows(array, windowSize, stepSize, true);

for (let i = 0; i < 6; i += 1) {
  console.log(buffer.next().value);
}
// [ 1, 2, 3 ]
// [ 3, 4, 5 ]
// [ 5, 1, 2 ]
// [ 2, 3, 4 ]
// [ 4, 5, 1 ]
// [ 1, 2, 3 ]
// ...
```

- tumbling non-wrapping

```ts
import { Windows } from "./src/mod.ts";

const array = [1, 2, 3, 4, 5];
const windowSize = 3;
const stepSize = 3;
const buffer = new Windows(array, windowSize, stepSize);

for (const window of buffer) {
  console.log(window);
}
// [ 1, 2, 3 ]
// [ 4, 5 ]
```

- tumbling wrapping

```ts
import { Windows } from "./src/mod.ts";

const array = [1, 2, 3, 4, 5];
const windowSize = 3;
const stepSize = 3;
const buffer = new Windows(array, windowSize, stepSize, true);

for (let i = 0; i < 6; i += 1) {
  console.log(buffer.next().value);
}
// [ 1, 2, 3 ]
// [ 4, 5, 1 ]
// [ 2, 3, 4 ]
// [ 5, 1, 2 ]
// [ 3, 4, 5 ]
// [ 1, 2, 3 ]
// ...
```
