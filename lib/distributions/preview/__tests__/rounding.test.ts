import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { allocateLargestRemainderCents } from "../rounding";

describe("distribution preview rounding", () => {
  it("allocates one-cent remainders and reconciles to source", () => {
    const rows = allocateLargestRemainderCents(BigInt(1), [
      { id: "a", participationAmountCents: BigInt(1), confirmedAt: "2026-01-01" },
      { id: "b", participationAmountCents: BigInt(1), confirmedAt: "2026-01-02" },
    ]);
    assert.equal(rows.reduce((sum, row) => sum + row.cents, BigInt(0)), BigInt(1));
    assert.equal(rows.find((row) => row.id === "a")?.cents, BigInt(1));
  });
  it("uses participation amount, confirmedAt, then id tie breakers", () => {
    const byAmount = allocateLargestRemainderCents(BigInt(1), [{ id: "small", participationAmountCents: BigInt(1) }, { id: "large", participationAmountCents: BigInt(1) }]);
    assert.equal(byAmount.find((row) => row.id === "large")?.cents, BigInt(0));
    const byDate = allocateLargestRemainderCents(BigInt(1), [{ id: "b", participationAmountCents: BigInt(1), confirmedAt: "2026-01-02" }, { id: "a", participationAmountCents: BigInt(1), confirmedAt: "2026-01-01" }]);
    assert.equal(byDate.find((row) => row.id === "a")?.cents, BigInt(1));
  });
});
