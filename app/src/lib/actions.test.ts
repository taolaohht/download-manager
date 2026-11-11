import { describe, expect, it } from "vitest";
import { actionableIds, deleteAndPreserveSelection } from "./actions";
import type { Status } from "./types";

describe("bulk download actions", () => {
  it("uses live progress status instead of a stale item snapshot", () => {
    const statuses: Record<string, Status | undefined> = {
      paused: "paused",
      active: "downloading",
      failed: "failed",
      queued: "queued",
      missing: undefined,
    };
    expect(actionableIds(["paused", "active", "failed", "queued", "missing"], statuses, "pause")).toEqual(["active", "queued"]);
    expect(actionableIds(["paused", "active", "failed", "queued", "missing"], statuses, "resume")).toEqual(["paused", "failed", "queued"]);
  });

  it("does not issue pause or resume actions for completed or missing items", () => {
    const statuses: Record<string, Status | undefined> = {
      completed: "completed",
      connecting: "connecting",
      idle: "idle",
    };
    expect(actionableIds(["completed", "connecting", "idle"], statuses, "pause")).toEqual(["connecting"]);
    expect(actionableIds(["completed", "connecting", "idle"], statuses, "resume")).toEqual(["idle"]);
  });
});

describe("delete selection handling", () => {
  it("removes only deleted ids after the backend succeeds", async () => {
    let selection = ["a", "b", "c"];
    let removed = false;
    await deleteAndPreserveSelection(
      ["b"],
      async () => { removed = true; },
      () => selection,
      (next) => { selection = next; },
      () => { throw new Error("unexpected delete failure"); },
    );
    expect(removed).toBe(true);
    expect(selection).toEqual(["a", "c"]);
  });

  it("keeps the selection intact when the backend rejects deletion", async () => {
    let selection = ["a", "b"];
    let failure: unknown;
    await deleteAndPreserveSelection(
      ["a"],
      async () => { throw new Error("file is locked"); },
      () => selection,
      (next) => { selection = next; },
      (error) => { failure = error; },
    );
    expect(selection).toEqual(["a", "b"]);
    expect(failure).toEqual(new Error("file is locked"));
  });
});
