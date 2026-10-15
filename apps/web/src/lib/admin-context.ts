// Request-scoped context for replaying an approved change.
//
// When a reviewer approves a university admin's queued edit, the original
// admin API handler runs again in-process (see lib/admin-changes.ts). While it
// runs, this context says "this write was approved by X", so the handler's own
// requireAdmin() lets it through as the approver and the write wrapper applies
// it instead of queueing it a second time.

import { AsyncLocalStorage } from "node:async_hooks";

import type { AdminActor } from "@/lib/admin";

type Approval = { approver: AdminActor; changeRequestId: string };

const storage = new AsyncLocalStorage<Approval>();

export function currentApproval(): Approval | undefined {
  return storage.getStore();
}

export function runAsApproval<T>(approval: Approval, fn: () => Promise<T>): Promise<T> {
  return storage.run(approval, fn);
}
