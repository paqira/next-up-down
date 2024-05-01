/**
 * Returns next up `number`.
 *
 * Port of Rust [`f64::next_up`][next_up].
 *
 * [next_up]: https://doc.rust-lang.org/std/primitive.f64.html#method.next_up
 *
 * @param {number} x
 * @returns {number} the next up `number` of x
 */
export const nextUp = (x: number): number => {
  if (x != x || x === Number.POSITIVE_INFINITY) {
    return x;
  } else if (x === Number.MAX_VALUE) {
    return Number.POSITIVE_INFINITY;
  }

  const U32_MIN = 0x0;
  const U32_MAX = 0xffff_ffff;
  const F64_SIGN_MASK = 0x7fffffff;
  const F64_BYTES = 8;
  const ORIGIN = 0;
  const OFFSET = 4;
  const LITTLE_ENDIAN = false;

  // make view
  const buffer = new ArrayBuffer(F64_BYTES);
  const view = new DataView(buffer);
  view.setFloat64(ORIGIN, x, LITTLE_ENDIAN);

  const upper = view.getUint32(ORIGIN, LITTLE_ENDIAN);
  const lower = view.getUint32(OFFSET, LITTLE_ENDIAN);

  const abs = upper & F64_SIGN_MASK;

  if (abs === 0 && lower === 0) {
    // case +-0, returns most tity normal number
    // clear buffer
    view.setFloat64(ORIGIN, 0.0, LITTLE_ENDIAN);
    // set most tity positive normal number
    view.setUint8(F64_BYTES - 1, 1);
  } else if (upper === abs) {
    // case positive
    if (lower === U32_MAX) {
      view.setUint32(ORIGIN, upper + 1, LITTLE_ENDIAN);
      view.setUint32(OFFSET, U32_MIN, LITTLE_ENDIAN);
    } else {
      view.setUint32(OFFSET, lower + 1, LITTLE_ENDIAN);
    }
  } else {
    // case negative
    if (lower === U32_MIN) {
      view.setUint32(ORIGIN, upper - 1, LITTLE_ENDIAN);
      view.setUint32(OFFSET, U32_MAX, LITTLE_ENDIAN);
    } else {
      view.setUint32(OFFSET, lower - 1, LITTLE_ENDIAN);
    }
  }

  return view.getFloat64(ORIGIN, LITTLE_ENDIAN);
};

/**
 * Returns next down `number`.
 *
 * Port of Rust [`f64::next_down`][next_down].
 *
 * [next_down]: https://doc.rust-lang.org/std/primitive.f64.html#method.next_down
 *
 * @param {number} x
 * @returns {number} the next down `number` of x
 */
export const nextDown = (x: number): number => {
  if (x != x || x === Number.NEGATIVE_INFINITY) {
    return x;
  } else if (x === -Number.MAX_VALUE) {
    return Number.NEGATIVE_INFINITY;
  }

  const U32_MIN = 0x0;
  const U32_MAX = 0xffff_ffff;
  const F64_SIGN_MASK = 0x7fffffff;
  const F64_BYTES = 8;
  const ORIGIN = 0;
  const OFFSET = 4;
  const LITTLE_ENDIAN = false;

  // make view
  const buffer = new ArrayBuffer(F64_BYTES);
  const view = new DataView(buffer);
  view.setFloat64(ORIGIN, x, LITTLE_ENDIAN);

  const upper = view.getUint32(ORIGIN, LITTLE_ENDIAN);
  const lower = view.getUint32(OFFSET, LITTLE_ENDIAN);

  const abs = upper & F64_SIGN_MASK;

  if (abs === 0 && lower === 0) {
    // case +-0, returns most tity normal number
    // clear buffer
    view.setFloat64(ORIGIN, 0.0, LITTLE_ENDIAN);
    // set most tity negative normal number
    view.setUint8(ORIGIN, 0x80);
    view.setUint8(F64_BYTES - 1, 1);
  } else if (upper === abs) {
    // case positive
    if (lower === U32_MIN) {
      view.setUint32(ORIGIN, upper - 1, LITTLE_ENDIAN);
      view.setUint32(OFFSET, U32_MAX, LITTLE_ENDIAN);
    } else {
      view.setUint32(OFFSET, lower - 1, LITTLE_ENDIAN);
    }
  } else {
    // case negative
    if (lower === U32_MAX) {
      view.setUint32(ORIGIN, upper + 1, LITTLE_ENDIAN);
      view.setUint32(OFFSET, U32_MIN, LITTLE_ENDIAN);
    } else {
      view.setUint32(OFFSET, lower + 1, LITTLE_ENDIAN);
    }
  }

  return view.getFloat64(ORIGIN, LITTLE_ENDIAN);
};

export default { nextUp, nextDown };
