export type AllocationInput = { id: string; participationAmountCents: bigint; confirmedAt?: Date | string | null };
export type AllocationResult = { id: string; cents: bigint; floorCents: bigint; roundingAdjustmentCents: bigint; remainderNumerator: bigint };

export function allocateLargestRemainderCents(poolCents: bigint, rows: AllocationInput[]): AllocationResult[] {
  if (poolCents < BigInt(0)) throw new Error("poolCents cannot be negative");
  const total = rows.reduce((sum, row) => sum + row.participationAmountCents, BigInt(0));
  if (total <= BigInt(0)) throw new Error("total participation amount must be greater than zero");
  const allocations = rows.map((row) => {
    const raw = poolCents * row.participationAmountCents;
    const floorCents = raw / total;
    return { id: row.id, cents: floorCents, floorCents, roundingAdjustmentCents: BigInt(0), remainderNumerator: raw % total };
  });
  let remaining = poolCents - allocations.reduce((sum, row) => sum + row.cents, BigInt(0));
  const byId = new Map(rows.map((row) => [row.id, row]));
  const order = [...allocations].sort((a, b) => {
    if (a.remainderNumerator !== b.remainderNumerator) return a.remainderNumerator > b.remainderNumerator ? -1 : 1;
    const ar = byId.get(a.id)!; const br = byId.get(b.id)!;
    if (ar.participationAmountCents !== br.participationAmountCents) return ar.participationAmountCents > br.participationAmountCents ? -1 : 1;
    const at = ar.confirmedAt ? new Date(ar.confirmedAt).getTime() : Number.MAX_SAFE_INTEGER;
    const bt = br.confirmedAt ? new Date(br.confirmedAt).getTime() : Number.MAX_SAFE_INTEGER;
    if (at !== bt) return at - bt;
    return a.id.localeCompare(b.id);
  });
  for (const allocation of order) {
    if (remaining <= BigInt(0)) break;
    allocation.cents += BigInt(1);
    allocation.roundingAdjustmentCents += BigInt(1);
    remaining -= BigInt(1);
  }
  return allocations;
}
