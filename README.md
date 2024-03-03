# windows

Sliding, hopping, and tumbling windows over an array



## Features

- sliding, hopping, and tumbling windows
- single pass or wrap around indefinitely
- iterator, e.g. can use in `for..of`



## Usage

- sliding

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

- hopping

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

- tumbling

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
