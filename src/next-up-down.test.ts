import { test, expect } from "@jest/globals";
import { nextUp, nextDown } from "./next-up-down.js";

const fromBits = (upper: number, lower: number): number => {
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  view.setUint32(0, upper, false);
  view.setUint32(4, lower, false);
  return view.getFloat64(0, false);
};

// expected values are from Rust

test("±NAN", () => {
  expect(nextUp(Number.NaN)).toBeNaN();
  expect(nextUp(-Number.NaN)).toBeNaN();
  expect(nextDown(Number.NaN)).toBeNaN();
  expect(nextDown(-Number.NaN)).toBeNaN();
});

test("±inf", () => {
  expect(nextUp(Number.POSITIVE_INFINITY)).toBe(Number.POSITIVE_INFINITY);
  expect(nextUp(Number.NEGATIVE_INFINITY)).toBe(-Number.MAX_VALUE);
  expect(nextDown(Number.POSITIVE_INFINITY)).toBe(Number.MAX_VALUE);
  expect(nextDown(Number.NEGATIVE_INFINITY)).toBe(Number.NEGATIVE_INFINITY);
});

test("±0.0", () => {
  const NEXT_UP_ZERO = Number.MIN_VALUE; // fromBits(0x0, 0x1)

  expect(nextUp(0.0)).toBe(NEXT_UP_ZERO);
  expect(nextUp(-0.0)).toBe(NEXT_UP_ZERO);
  expect(nextDown(0.0)).toBe(-NEXT_UP_ZERO);
  expect(nextDown(-0.0)).toBe(-NEXT_UP_ZERO);
});

test("±1.0", () => {
  const NEXT_UP_ONE = fromBits(0x3ff0_0000, 0x1);
  const NEXT_DOWN_ONE = fromBits(0x3fef_ffff, 0xffff_ffff);

  expect(nextUp(1.0)).toBe(NEXT_UP_ONE);
  expect(nextUp(-1.0)).toBe(-NEXT_DOWN_ONE);
  expect(nextUp(1.0)).toBe(1.0 + Number.EPSILON);
  expect(nextDown(1.0)).toBe(NEXT_DOWN_ONE);
  expect(nextDown(-1.0)).toBe(-NEXT_UP_ONE);
  expect(nextDown(-1.0)).toBe(-1.0 - Number.EPSILON);
});

test("±min normal", () => {
  const MIN_POS_NORMAL = fromBits(0x1000_0000, 0x0);
  const NEXT_UP_MIN_POS_NORMAL = fromBits(0x1000_0000, 0x1);
  const NEXT_DOWN_MIN_POS_NORMAL = fromBits(0x0fff_ffff, 0xffff_ffff);

  expect(nextUp(MIN_POS_NORMAL)).toBe(NEXT_UP_MIN_POS_NORMAL);
  expect(nextUp(-MIN_POS_NORMAL)).toBe(-NEXT_DOWN_MIN_POS_NORMAL);
  expect(nextDown(MIN_POS_NORMAL)).toBe(NEXT_DOWN_MIN_POS_NORMAL);
  expect(nextDown(-MIN_POS_NORMAL)).toBe(-NEXT_UP_MIN_POS_NORMAL);
});

test("±max normal", () => {
  const MAX_POS_NORMAL = Number.MAX_VALUE;
  const NEXT_DOWN_MAX_POS_NORMAL = fromBits(0x7fef_ffff, 0xffff_fffe);

  expect(nextUp(MAX_POS_NORMAL)).toBe(Number.POSITIVE_INFINITY);
  expect(nextUp(-MAX_POS_NORMAL)).toBe(-NEXT_DOWN_MAX_POS_NORMAL);
  expect(nextDown(MAX_POS_NORMAL)).toBe(NEXT_DOWN_MAX_POS_NORMAL);
  expect(nextDown(-MAX_POS_NORMAL)).toBe(Number.NEGATIVE_INFINITY);
});

test("±min subnormal", () => {
  const MIN_POS_SUBNORMAL = Number.MIN_VALUE; // fromBits(0x0, 0x1)
  const NEXT_UP_MIN_POS_SUBNORMAL = fromBits(0x0, 0x2);
  const NEXT_DOWN_MIN_POS_SUBNORMAL = fromBits(0x0, 0x0); // 0.0

  expect(nextUp(MIN_POS_SUBNORMAL)).toBe(NEXT_UP_MIN_POS_SUBNORMAL);
  expect(nextUp(-MIN_POS_SUBNORMAL)).toBe(-NEXT_DOWN_MIN_POS_SUBNORMAL);
  expect(nextDown(MIN_POS_SUBNORMAL)).toBe(NEXT_DOWN_MIN_POS_SUBNORMAL);
  expect(nextDown(-MIN_POS_SUBNORMAL)).toBe(-NEXT_UP_MIN_POS_SUBNORMAL);
});

test("±max subnormal", () => {
  const MAX_POS_SUBNORMAL = fromBits(0x000f_ffff, 0xffff_ffff);
  const NEXT_UP_MAX_POS_SUBNORMAL = fromBits(0x0010_0000, 0x0);
  const NEXT_DOWN_MAX_POS_SUBNORMAL = fromBits(0x000f_ffff, 0xffff_fffe);

  expect(nextUp(MAX_POS_SUBNORMAL)).toBe(NEXT_UP_MAX_POS_SUBNORMAL);
  expect(nextUp(-MAX_POS_SUBNORMAL)).toBe(-NEXT_DOWN_MAX_POS_SUBNORMAL);
  expect(nextDown(MAX_POS_SUBNORMAL)).toBe(NEXT_DOWN_MAX_POS_SUBNORMAL);
  expect(nextDown(-MAX_POS_SUBNORMAL)).toBe(-NEXT_UP_MAX_POS_SUBNORMAL);
});
