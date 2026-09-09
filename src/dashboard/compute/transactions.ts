import type { Shares } from "../../types";
import { groupNumber, isoDate, shortAddress } from "../format";
import { networkMeta, snapshotTimestamp } from "../networks";
import type { Ledger, Selection } from "../types";
import { ledgerKey } from "../types";
import type { TxRow } from "../viewTypes";

const WINDOW_SNAPSHOTS = 7;

export interface BlockRange {
  from: string;
  to: string;
}

/** Default block window: the selected contract's block span over the last 7 snapshots. */
export function defaultBlockRange(data: Shares[], day: number, selection: Selection): BlockRange {
  const index = day - 1;
  const startIndex = Math.max(0, index - WINDOW_SNAPSHOTS + 1);
  const from = data[startIndex].blockNumbers[selection.network].block;
  const to = data[index].blockNumbers[selection.network].block;
  return { from: from.toString(), to: to.toString() };
}

export function computeTransactions(params: { ledger: Ledger; selection: Selection; range: BlockRange }): {
  rows: TxRow[];
  totalCount: number;
} {
  const { ledger, selection, range } = params;
  const network = networkMeta(selection.network);
  const lo = range.from === "" ? -Infinity : Number(range.from);
  const hi = range.to === "" ? Infinity : Number(range.to);
  const all = ledger[ledgerKey(selection.network, selection.kind)] ?? [];

  const rows = all
    .filter((t) => t.block >= lo && t.block <= hi)
    .sort((a, b) => b.block - a.block)
    .map((t) => ({
      block: groupNumber(t.block),
      date: isoDate(snapshotTimestamp(t.day)),
      event: t.event,
      amount: t.amount,
      from: shortAddress(t.from),
      to: shortAddress(t.to),
      hash: shortAddress(t.hash),
      url: `${network.explorer}/tx/${t.hash.replace("*", "")}`,
      flagged: Boolean(t.flagged),
    }));

  return { rows, totalCount: all.length };
}
