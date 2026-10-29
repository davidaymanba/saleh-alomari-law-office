/** رابط واتساب مع رسالة مُرمّزة */
export function whatsappUrl(number: string, text?: string) {
  const base = `https://wa.me/${number.replace(/[\s+()-]/g, "")}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export type ConsultationMessage = {
  applicantType: string;
  caseType: string;
  service: string;
  urgency: string;
  details: string;
  name: string;
  phone: string;
  city: string;
  contactMethod: string;
};

/** نص رسالة طلب الخدمة القانونية كما يُرسل إلى واتساب */
export function buildConsultationMessage(m: ConsultationMessage) {
  return [
    "السلام عليكم، أرغب في طلب خدمة قانونية:",
    `• الصفة: ${m.applicantType}`,
    `• نوع القضية: ${m.caseType}`,
    `• نوع الطلب: ${m.service}`,
    `• الاستعجال: ${m.urgency}`,
    `• التفاصيل: ${m.details}`,
    `• الاسم: ${m.name} | الجوال: ${m.phone} | المدينة: ${m.city}`,
    `• طريقة التواصل المفضلة: ${m.contactMethod}`,
  ].join("\n");
}
