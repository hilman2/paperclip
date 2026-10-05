import { describe, expect, it } from "vitest";
import {
  resolveJoinRequestAgentManagerId,
  resolveJoinRequestAgentPlacement,
} from "../routes/access.js";

describe("resolveJoinRequestAgentManagerId", () => {
  it("returns null when no CEO exists in the company agent list", () => {
    const managerId = resolveJoinRequestAgentManagerId([
      { id: "a1", role: "cto", reportsTo: null },
      { id: "a2", role: "engineer", reportsTo: "a1" },
    ]);

    expect(managerId).toBeNull();
  });

  it("selects the root CEO when available", () => {
    const managerId = resolveJoinRequestAgentManagerId([
      { id: "ceo-child", role: "ceo", reportsTo: "manager-1" },
      { id: "manager-1", role: "cto", reportsTo: null },
      { id: "ceo-root", role: "ceo", reportsTo: null },
    ]);

    expect(managerId).toBe("ceo-root");
  });

  it("falls back to the first CEO when no root CEO is present", () => {
    const managerId = resolveJoinRequestAgentManagerId([
      { id: "ceo-1", role: "ceo", reportsTo: "mgr" },
      { id: "ceo-2", role: "ceo", reportsTo: "mgr" },
      { id: "mgr", role: "cto", reportsTo: null },
    ]);

    expect(managerId).toBe("ceo-1");
  });
});

describe("resolveJoinRequestAgentPlacement", () => {
  it("makes the first agent the root CEO when the company has no CEO", () => {
    expect(resolveJoinRequestAgentPlacement([])).toEqual({
      role: "ceo",
      title: "CEO",
      reportsTo: null,
    });
    expect(
      resolveJoinRequestAgentPlacement([{ id: "a1", role: "cto", reportsTo: null }]),
    ).toEqual({ role: "ceo", title: "CEO", reportsTo: null });
  });

  it("places agents under the root CEO when one exists", () => {
    expect(
      resolveJoinRequestAgentPlacement([{ id: "ceo-root", role: "ceo", reportsTo: null }]),
    ).toEqual({ role: "general", title: null, reportsTo: "ceo-root" });
  });
});
