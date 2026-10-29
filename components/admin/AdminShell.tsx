"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  Briefcase,
  ExternalLink,
  HelpCircle,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  Scale,
  Settings,
  UserCircle,
  Users,
  UsersRound,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { roleLabels, type Role } from "@/lib/auth-shared";
import { BrandMark } from "@/components/ui/BrandMark";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { logout } from "@/app/admin/actions";

type Item = { href: string; label: string; icon: LucideIcon; badge?: number; exact?: boolean };

export function AdminShell({
  user,
  brand,
  newRequests,
  children,
}: {
  user: { name: string; role: Role };
  brand: string;
  newRequests: number;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const groups: { title?: string; items: Item[] }[] = [
    {
      items: [
        { href: "/admin", label: "نظرة عامة", icon: LayoutDashboard, exact: true },
        { href: "/admin/requests", label: "طلبات الاستشارة", icon: Inbox, badge: newRequests },
        { href: "/admin/analytics", label: "الإحصاءات", icon: BarChart3 },
      ],
    },
    {
      title: "المحتوى",
      items: [
        { href: "/admin/content/services", label: "الخدمات", icon: Briefcase },
        { href: "/admin/content/areas", label: "مجالات الممارسة", icon: Scale },
        { href: "/admin/content/team", label: "الفريق", icon: UsersRound },
        { href: "/admin/content/guides", label: "الأدلة القانونية", icon: BookOpen },
        { href: "/admin/content/faq", label: "الأسئلة الشائعة", icon: HelpCircle },
      ],
    },
    ...(user.role === "admin"
      ? [
          {
            title: "الإدارة",
            items: [
              { href: "/admin/settings", label: "إعدادات الموقع", icon: Settings },
              { href: "/admin/users", label: "المستخدمون", icon: Users },
            ],
          },
        ]
      : []),
  ];

  const isActive = (i: Item) => (i.exact ? pathname === i.href : pathname === i.href || pathname.startsWith(`${i.href}/`));

  const sidebar = (
    <div className="flex h-full flex-col">
      <Link href="/admin" className="flex items-center gap-3 px-5 py-5">
        <BrandMark height={46} />
        <span className="flex flex-col leading-tight">
          <span className="font-display text-lg font-bold">{brand}</span>
          <span className="text-xs text-paper/55">لوحة التحكم</span>
        </span>
      </Link>
      <nav aria-label="لوحة التحكم" className="flex-1 overflow-y-auto px-3 pb-6">
        {groups.map((g, gi) => (
          <div key={gi} className="mt-4 first:mt-1">
            {g.title && <p className="px-3 pb-1.5 text-xs font-semibold text-paper/45">{g.title}</p>}
            <ul className="grid gap-0.5">
              {g.items.map((i) => {
                const active = isActive(i);
                const Icon = i.icon;
                return (
                  <li key={i.href}>
                    <Link
                      href={i.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 text-sm transition-colors",
                        active ? "bg-paper/10 font-semibold text-paper" : "text-paper/70 hover:bg-paper/5 hover:text-paper",
                      )}
                    >
                      <Icon className={cn("size-[1.1rem]", active && "text-gold-soft")} strokeWidth={1.7} aria-hidden="true" />
                      <span className="flex-1">{i.label}</span>
                      {!!i.badge && (
                        <span className="min-w-6 bg-gold px-1.5 py-0.5 text-center text-xs font-bold text-paper">
                          {i.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="border-t border-paper/10 p-3">
        <Link
          href="/admin/account"
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-paper/80 transition-colors hover:bg-paper/5"
        >
          <UserCircle className="size-5 text-paper/60" strokeWidth={1.6} aria-hidden="true" />
          <span className="flex flex-1 flex-col leading-tight">
            <span className="font-semibold text-paper">{user.name}</span>
            <span className="text-xs text-paper/50">{roleLabels[user.role]}</span>
          </span>
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full cursor-pointer items-center gap-3 px-3 py-2.5 text-sm text-paper/70 transition-colors hover:bg-paper/5 hover:text-paper"
          >
            <LogOut className="size-[1.1rem]" strokeWidth={1.7} aria-hidden="true" />
            تسجيل الخروج
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-dvh bg-sand/50">
      <aside className="on-dark sticky top-0 hidden h-dvh w-64 shrink-0 bg-ink text-paper lg:block">{sidebar}</aside>

      {/* درج الجوال */}
      <div className={cn("fixed inset-0 z-50 lg:hidden", open ? "visible" : "invisible")} aria-hidden={!open}>
        <div
          className={cn("absolute inset-0 bg-black/40 transition-opacity", open ? "opacity-100" : "opacity-0")}
          onClick={() => setOpen(false)}
        />
        <aside
          inert={!open}
          className={cn(
            "on-dark absolute inset-y-0 start-0 w-72 max-w-[85vw] bg-ink text-paper transition-transform duration-300",
            open ? "translate-x-0" : "translate-x-full",
          )}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="إغلاق القائمة"
            className="absolute end-3 top-5 grid size-9 cursor-pointer place-items-center text-paper/70"
          >
            <X className="size-5" />
          </button>
          {sidebar}
        </aside>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-ink/10 bg-paper/90 px-4 backdrop-blur md:px-8">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="فتح القائمة"
            className="grid size-10 cursor-pointer place-items-center lg:hidden"
          >
            <Menu className="size-5" />
          </button>
          <div className="flex-1" />
          <a href="/" target="_blank" rel="noopener" className="abtn abtn-ghost abtn-sm">
            <ExternalLink className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">عرض الموقع</span>
          </a>
          <ThemeToggle className="size-9" />
        </header>
        <main id="main" className="flex-1 px-4 py-8 md:px-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
