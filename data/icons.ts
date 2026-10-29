/** مفاتيح الأيقونات المستخدمة في المحتوى (تُربط بمكوّنات lucide في components/ui/Icon.tsx) */
export const iconKeys = [
  "consultation",
  "representation",
  "memo",
  "lawsuit",
  "hearings",
  "family",
  "labor",
  "realEstate",
  "inheritance",
  "criminal",
  "enforcement",
  "formation",
  "contracts",
  "commercial",
  "investment",
  "arbitration",
  "ip",
] as const;

export type IconKey = (typeof iconKeys)[number];

/** أسماء عربية للأيقونات (لقوائم الاختيار في لوحة التحكم) */
export const iconLabels: Record<IconKey, string> = {
  consultation: "محادثة / استشارة",
  representation: "شارة توثيق",
  memo: "مستند وقلم",
  lawsuit: "مطرقة القاضي",
  hearings: "مبنى المحكمة",
  family: "أسرة",
  labor: "حقيبة عمل",
  realEstate: "مبانٍ",
  inheritance: "وثيقة ملفوفة",
  criminal: "درع وتنبيه",
  enforcement: "ختم",
  formation: "مبنى شركة",
  contracts: "عقد وتوقيع",
  commercial: "مصافحة",
  investment: "كرة أرضية",
  arbitration: "ميزان",
  ip: "مصباح فكرة",
};
