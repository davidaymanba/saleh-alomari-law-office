"use client";

/**
 * تنسيق لحظة "ظهور الصفحة":
 * ما دامت شاشة التحميل أو ستارة الانتقال تغطي الصفحة، تُؤجَّل حركات الظهور حتى تنكشف.
 */

type Listener = () => void;

let covers = 0;
const listeners = new Set<Listener>();

function preloading() {
  return (
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("is-preloading")
  );
}

export function isRevealBlocked() {
  return covers > 0 || preloading();
}

/** يُستدعى عند بدء تغطية الصفحة (ستارة الانتقال) */
export function blockReveal() {
  covers += 1;
}

/** يُستدعى عند انكشاف الصفحة */
export function releaseReveal() {
  covers = Math.max(0, covers - 1);
  flush();
}

/** يُستدعى بعد انتهاء شاشة التحميل */
export function endPreload() {
  document.documentElement.classList.remove("is-preloading");
  flush();
}

function flush() {
  if (isRevealBlocked()) return;
  const queued = [...listeners];
  listeners.clear();
  queued.forEach((fn) => fn());
}

/**
 * ينفّذ cb فور انكشاف الصفحة (أو مباشرة إن كانت مكشوفة).
 * يعيد دالة إلغاء للاستخدام في تنظيف useGSAP.
 */
export function onRevealReady(cb: Listener): () => void {
  if (!isRevealBlocked()) {
    cb();
    return () => {};
  }
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}
