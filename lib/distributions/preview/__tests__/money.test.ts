import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { centsToMoney, parseMoneyToCents } from "../money";

describe("distribution preview money", () => {
  it("parses decimal strings to cents", () => {
    assert.equal(parseMoneyToCents("0.00"), BigInt(0));
    assert.equal(parseMoneyToCents("1.23"), BigInt(123));
    assert.equal(centsToMoney(BigInt(123)), "1.23");
  });
  it("rejects invalid, over-precise, and negative money", () => {
    assert.throws(() => parseMoneyToCents("abc"));
    assert.throws(() => parseMoneyToCents("1.234"));
    assert.throws(() => parseMoneyToCents("-1.00"));
  });
});
