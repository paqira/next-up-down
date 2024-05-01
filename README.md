# next-up-down

JavaScript/TypeScript port of Rust [`f64::next_up`][next_up] and [`f64::next_down`][next_down].

[next_up]: https://doc.rust-lang.org/std/primitive.f64.html#method.next_up
[next_down]: https://doc.rust-lang.org/std/primitive.f64.html#method.next_down

## Usage

This Library supports `ES5` and higher.

```js
// prints true
console.log(next_up_down.nextUp(1.0) === 1.0 + Number.EPSILON);
// prints true
console.log(next_up_down.nextDown(-1.0) === -1.0 - Number.EPSILON);
```

## Licence

MIT or Apache-2.0
