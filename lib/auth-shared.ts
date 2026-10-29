/** ثوابت المصادقة المشتركة بين الخادم والـ middleware */
export const SESSION_COOKIE = "alomari_session";

export const roles = ["admin", "editor"] as const;
export type Role = (typeof roles)[number];

export const roleLabels: Record<Role, string> = {
  admin: "مدير",
  editor: "محرر",
};

export const roleDescriptions: Record<Role, string> = {
  admin: "صلاحيات كاملة: المحتوى والطلبات والإحصاءات وإعدادات الموقع والمستخدمين",
  editor: "المحتوى والطلبات والإحصاءات، دون إعدادات الموقع وإدارة المستخدمين",
};
