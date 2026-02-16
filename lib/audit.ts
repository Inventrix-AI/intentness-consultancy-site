import { makeId } from "@/lib/server-utils";
import { saveAudit } from "@/lib/store";
import type { AuditEvent } from "@/lib/types";
import { nowIso } from "@/lib/utils";

export async function logAudit(action: string, entity: AuditEvent["entity"], payload: Record<string, unknown>) {
  const event: AuditEvent = {
    id: makeId("audit"),
    at: nowIso(),
    action,
    entity,
    payload
  };
  await saveAudit(event);
  console.log(JSON.stringify({ type: "audit", ...event }));
}
