import { beforeEach, describe, expect, it } from "vitest";
import { counts, handleEvent, useApp, visibleItems } from "./store";
import type { DownloadItem, Progress, Status } from "./types";

const item = (status: Status): DownloadItem => ({
  id: "a",
  kind: "http",
  url: "https://example.com/file.zip",
  fileName: "file.zip",
  saveDir: "/downloads",
  size: 1000,
  downloaded: 1000,
  status,
  category: "compressed",
  description: "",
  addedAt: 0,
  connections: 8,
  speedLimit: 0,
  trashed: false,
  position: 0,
  mirrors: [],
});
const progress = (downloaded: number): Progress => ({ id: "a", status: "downloading", downloaded, size: 1000, speed: 5000, connections: 8 });

describe("live progress (#41)", () => {
  beforeEach(() => useApp.setState({ items: { a: item("downloading") }, progress: {} }));

  it("progress that arrives after the download finished doesn't bring it back", () => {
    handleEvent({ type: "progress", payload: [progress(900)] });
    expect(useApp.getState().progress.a?.downloaded).toBe(900);
    handleEvent({ type: "itemUpdated", payload: item("completed") });
    expect(useApp.getState().progress.a).toBeUndefined();
    // A late tick: the row must stay completed.
    handleEvent({ type: "progress", payload: [progress(1000)] });
    expect(useApp.getState().progress.a).toBeUndefined();
    expect(useApp.getState().items.a.status).toBe("completed");
  });

  it("a download started again shows its progress", () => {
    handleEvent({ type: "itemUpdated", payload: item("completed") });
    handleEvent({ type: "itemUpdated", payload: item("connecting") });
    handleEvent({ type: "progress", payload: [progress(10)] });
    expect(useApp.getState().progress.a?.downloaded).toBe(10);
  });

  it("the whole list sent again drops the progress of downloads that stopped", () => {
    handleEvent({ type: "progress", payload: [progress(500)] });
    handleEvent({ type: "itemsAdded", payload: [item("completed")] });
    expect(useApp.getState().progress.a).toBeUndefined();
    expect(useApp.getState().items.a.status).toBe("completed");
  });
});

describe("live status in views and counts", () => {
  it("uses the latest progress status for sidebar views and counters", () => {
    const completed = { ...item("completed"), id: "b", fileName: "done.zip" };
    const state = {
      ...useApp.getState(),
      items: { a: item("paused"), b: completed },
      progress: { a: progress(400) },
      view: { kind: "status" as const, id: "active" as const },
      search: "",
      sort: { key: "status" as const, dir: 1 as const },
    };

    expect(visibleItems(state).map((x) => x.id)).toEqual(["a"]);
    expect(counts(state)).toMatchObject({
      all: 2,
      unfinished: 1,
      finished: 1,
      active: 1,
      failed: 0,
    });
  });

  it("sorts by the live status rather than a stale item snapshot", () => {
    const paused = { ...item("paused"), id: "b", fileName: "paused.zip" };
    const state = {
      ...useApp.getState(),
      items: { a: item("paused"), b: paused },
      progress: { a: progress(400) },
      view: { kind: "all" as const },
      search: "",
      sort: { key: "status" as const, dir: -1 as const },
    };

    expect(visibleItems(state).map((x) => x.id)).toEqual(["b", "a"]);
  });
});
