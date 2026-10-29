/** حالات طلبات الاستشارة (مشتركة بين الخادم والمتصفح) */
export const requestStatuses = ["new", "in_review", "contacted", "closed", "spam"] as const;
export type RequestStatus = (typeof requestStatuses)[number];

export const requestStatusLabels: Record<RequestStatus, string> = {
  new: "جديد",
  in_review: "قيد الدراسة",
  contacted: "تم التواصل",
  closed: "مغلق",
  spam: "مزعج",
};

export function isRequestStatus(v: unknown): v is RequestStatus {
  return typeof v === "string" && (requestStatuses as readonly string[]).includes(v);
}
