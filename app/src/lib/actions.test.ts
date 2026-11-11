import { describe, expect, it } from "vitest";
import { actionableIds } from "./actions";
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
