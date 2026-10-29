/** روابط التنقل الثابتة (بنية الموقع، لا تُعدّل من لوحة التحكم) */
export type NavItem = { href: string; label: string };

export const mainNav: NavItem[] = [
  { href: "/about", label: "من نحن" },
  { href: "/services", label: "الخدمات" },
  { href: "/practice-areas", label: "مجالات الممارسة" },
  { href: "/team", label: "الفريق" },
  { href: "/guides", label: "أدلة قانونية" },
  { href: "/contact", label: "تواصل معنا" },
];

export const footerNav: NavItem[] = [
  { href: "/", label: "الرئيسية" },
  ...mainNav,
  { href: "/faq", label: "الأسئلة الشائعة" },
  { href: "/consultation", label: "اطلب استشارة" },
];
