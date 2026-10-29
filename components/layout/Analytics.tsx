"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** يسجّل زيارة الصفحة (بلا كوكيز ولا بيانات شخصية) */
export function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    const body = JSON.stringify({ path: pathname, referrer: document.referrer });
    try {
      if (!navigator.sendBeacon?.("/api/track", new Blob([body], { type: "application/json" }))) {
        fetch("/api/track", { method: "POST", body, keepalive: true, headers: { "content-type": "application/json" } });
      }
    } catch {}
  }, [pathname]);

  return null;
}
