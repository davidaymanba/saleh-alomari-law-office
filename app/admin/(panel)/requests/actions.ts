"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { isRequestStatus } from "@/lib/requests-shared";

export type UpdateState = { ok?: boolean; error?: string };

export async function updateRequest(id: number, _prev: UpdateState, form: FormData): Promise<UpdateState> {
  await requireUser();
  const status = form.get("status");
  const notes = String(form.get("notes") ?? "").slice(0, 5000);
  const assignedRaw = String(form.get("assigned_to") ?? "");
  const assigned = assignedRaw ? Number(assignedRaw) : null;
  if (!isRequestStatus(status)) return { error: "حالة غير صحيحة" };
  if (assigned !== null && !db().prepare("SELECT 1 FROM users WHERE id = ?").get(assigned)) {
    return { error: "المستخدم غير موجود" };
  }
  db()
    .prepare("UPDATE requests SET status = ?, notes = ?, assigned_to = ?, updated_at = datetime('now') WHERE id = ?")
    .run(status, notes, assigned, id);
  revalidatePath("/admin", "layout");
  return { ok: true };
}

export async function deleteRequest(id: number) {
  await requireUser("admin");
  db().prepare("DELETE FROM requests WHERE id = ?").run(id);
  revalidatePath("/admin", "layout");
  redirect("/admin/requests?deleted=1");
}
