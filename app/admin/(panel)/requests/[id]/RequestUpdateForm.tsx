"use client";

import { useActionState } from "react";
import { Check } from "lucide-react";
import { requestStatusLabels, requestStatuses, type RequestStatus } from "@/lib/requests-shared";
import { updateRequest, type UpdateState } from "../actions";

export function RequestUpdateForm({
  id,
  status,
  notes,
  assignedTo,
  users,
}: {
  id: number;
  status: RequestStatus;
  notes: string;
  assignedTo: number | null;
  users: { id: number; name: string }[];
}) {
  const [state, action, pending] = useActionState<UpdateState, FormData>(updateRequest.bind(null, id), {});

  return (
    <form action={action} className="grid gap-4">
      <div className="grid gap-1.5">
        <label htmlFor="status" className="text-sm font-semibold">
          الحالة
        </label>
        <select id="status" name="status" defaultValue={status} className="ainput cursor-pointer">
          {requestStatuses.map((s) => (
            <option key={s} value={s}>
              {requestStatusLabels[s]}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-1.5">
        <label htmlFor="assigned_to" className="text-sm font-semibold">
          المحامي المسؤول
        </label>
        <select id="assigned_to" name="assigned_to" defaultValue={assignedTo ?? ""} className="ainput cursor-pointer">
          <option value="">— غير محدد —</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-1.5">
        <label htmlFor="notes" className="text-sm font-semibold">
          ملاحظات داخلية
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={5}
          defaultValue={notes}
          placeholder="ما تم مع العميل، الرسوم المقترحة، الخطوة التالية…"
          className="ainput resize-y"
        />
      </div>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className="abtn abtn-primary">
          {pending ? "جارٍ الحفظ…" : "حفظ"}
        </button>
        {state.ok && !pending && (
          <span role="status" className="inline-flex items-center gap-1 text-sm text-[#25643f] dark:text-[#7fd1a0]">
            <Check className="size-4" aria-hidden="true" /> تم الحفظ
          </span>
        )}
        {state.error && (
          <span role="alert" className="text-sm font-semibold text-[#d92d20]">
            {state.error}
          </span>
        )}
      </div>
    </form>
  );
}
