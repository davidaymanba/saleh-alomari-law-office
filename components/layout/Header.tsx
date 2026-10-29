"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis-store";
import { mainNav, site } from "@/data/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const header = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  // إخفاء الرأس عند النزول وإظهاره عند الصعود
  useGSAP(
    () => {
      const el = header.current;
      if (!el) return;
      const show = gsap.quickTo(el, "yPercent", { duration: 0.5, ease: "power3.out" });
      const st = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const y = self.scroll();
          setScrolled(y > 24);
          if (el.dataset.menuOpen === "true") return show(0);
          show(self.direction === 1 && y > 160 ? -110 : 0);
        },
      });
      return () => st.kill();
    },
    { scope: header },
  );

  // فتح/إغلاق القائمة
  useGSAP(
    () => {
      const el = menu.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const instant = prefersReducedMotion();
      if (open) {
        getLenis()?.stop();
        gsap
          .timeline()
          .set(el, { visibility: "visible" })
          .fromTo(
            el,
            { clipPath: "inset(0% 0% 100% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: instant ? 0 : 0.8, ease: "najdi" },
          )
          .fromTo(
            q("[data-menu-item]"),
            { yPercent: 110 },
            { yPercent: 0, duration: instant ? 0 : 0.8, stagger: 0.05 },
            instant ? 0 : 0.3,
          )
          .fromTo(q("[data-menu-foot]"), { opacity: 0 }, { opacity: 1, duration: instant ? 0 : 0.6 }, "<0.2");
        q<HTMLAnchorElement>("a")[0]?.focus({ preventScroll: true });
      } else if (el.style.visibility === "visible") {
        getLenis()?.start();
        gsap.to(el, {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: instant ? 0 : 0.6,
          ease: "najdi",
          onComplete: () => gsap.set(el, { visibility: "hidden" }),
        });
      }
    },
    { dependencies: [open] },
  );

  // إغلاق عند تغيير الصفحة أو بالضغط على Escape
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header
        ref={header}
        data-menu-open={open}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,color] duration-500",
          open
            ? "on-dark border-b border-transparent text-paper"
            : scrolled
              ? "border-b border-ink/10 bg-paper/90 backdrop-blur-md"
              : "border-b border-transparent",
        )}
      >
        <div className="container-x flex h-20 items-center justify-between gap-6">
          <TransitionLink href="/" aria-label={`${site.name} — الصفحة الرئيسية`} className="relative z-10">
            <Logo />
          </TransitionLink>

          <nav aria-label="القائمة الرئيسية" className="hidden lg:block">
            <ul className="flex items-center gap-7 text-[0.95rem] font-medium">
              {mainNav.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <TransitionLink
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative py-2 transition-colors duration-300 hover:text-clay",
                        active && "text-clay",
                      )}
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute -bottom-0.5 left-1/2 size-1.5 -translate-x-1/2 rotate-45 bg-clay transition-transform duration-500",
                          active ? "scale-100" : "scale-0",
                        )}
                      />
                    </TransitionLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="relative z-10 flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <div className="hidden sm:block">
              <Button href="/consultation" variant={open ? "light" : "primary"} className="!min-h-11 !px-5 text-[0.95rem]">
                اطلب استشارة
              </Button>
            </div>
            <button
              ref={toggle}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
              className="grid size-11 cursor-pointer place-items-center lg:hidden"
            >
              <span className="relative block h-3.5 w-6" aria-hidden="true">
                <span
                  className={cn(
                    "absolute inset-x-0 top-0 h-0.5 bg-current transition-transform duration-500 ease-[var(--ease-najdi)]",
                    open && "translate-y-1.5 rotate-45",
                  )}
                />
                <span
                  className={cn(
                    "absolute inset-x-0 bottom-0 h-0.5 bg-current transition-transform duration-500 ease-[var(--ease-najdi)]",
                    open && "-translate-y-1.5 -rotate-45",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        ref={menu}
        id="mobile-menu"
        data-lenis-prevent
        inert={!open}
        className="on-dark invisible fixed inset-0 z-40 overflow-y-auto bg-ink text-paper lg:hidden"
      >
        <div className="texture-dots-light absolute inset-0" aria-hidden="true" />
        <div className="container-x relative flex min-h-full flex-col pt-28 pb-10">
          <nav aria-label="قائمة الجوال">
            <ul className="flex flex-col gap-1">
              {[{ href: "/", label: "الرئيسية" }, ...mainNav].map((item, i) => (
                <li key={item.href} className="overflow-hidden">
                  <TransitionLink
                    href={item.href}
                    data-menu-item
                    aria-current={pathname === item.href ? "page" : undefined}
                    className={cn(
                      "flex items-baseline gap-4 py-2 font-display text-3xl font-semibold sm:text-4xl",
                      pathname === item.href && "text-clay-soft",
                    )}
                  >
                    <span className="font-sans text-xs font-medium text-paper/40">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {item.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>
          <div data-menu-foot className="mt-auto flex flex-col gap-5 border-t border-paper/15 pt-8">
            <Button href="/consultation" variant="primary" className="w-full sm:w-auto">
              اطلب استشارة
            </Button>
            <div className="flex flex-wrap gap-x-8 gap-y-3 text-paper/75">
              <a href={whatsappUrl(site.whatsappGreeting)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                <WhatsAppIcon className="size-4.5" /> واتساب
              </a>
              <a href={`tel:${site.contact.phoneHref}`} className="inline-flex items-center gap-2">
                <Phone className="size-4" aria-hidden="true" />
                <span dir="ltr">{site.contact.phone}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
