import { createHash } from "node:crypto";
import { db } from "@/lib/db";
import { clientIp } from "@/lib/rate-limit";

const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|lighthouse|pingdom|monitor/i;

function safeDecode(path: string) {
  try {
    return decodeURI(path);
  } catch {
    return path;
  }
}

function device(ua: string) {
  if (/ipad|tablet/i.test(ua)) return "tablet";
  if (/mobi|android|iphone/i.test(ua)) return "mobile";
  return "desktop";
}

/**
 * تسجيل زيارة صفحة. لا كوكيز ولا عناوين IP محفوظة:
 * الزائر يُعرَّف ببصمة يومية مجهولة (ملح سري + التاريخ + IP + المتصفح) لا يمكن عكسها.
 */
export async function POST(req: Request) {
  const ua = req.headers.get("user-agent") ?? "";
  if (!ua || BOT.test(ua)) return new Response(null, { status: 204 });

  let body: { path?: unknown; referrer?: unknown };
  try {
    body = await req.json();
  } catch {
    return new Response(null, { status: 400 });
  }
  const path = typeof body.path === "string" ? body.path.slice(0, 300) : "";
  if (!path.startsWith("/") || path.startsWith("/admin") || path.startsWith("/api")) {
    return new Response(null, { status: 204 });
  }

  // نحتفظ بنطاق المُحيل الخارجي فقط
  let referrer: string | null = null;
  if (typeof body.referrer === "string" && body.referrer) {
    try {
      const host = new URL(body.referrer).hostname.replace(/^www\./, "");
      const own = (req.headers.get("host") ?? "").split(":")[0].replace(/^www\./, "");
      if (host && host !== own) referrer = host;
    } catch {}
  }

  const d = db();
  const { value: salt } = d.prepare("SELECT value FROM settings WHERE key = 'analytics_salt'").get() as { value: string };
  const day = new Date().toISOString().slice(0, 10);
  const visitor = createHash("sha256").update(`${salt}|${day}|${clientIp(req.headers)}|${ua}`).digest("hex").slice(0, 20);

  d.prepare("INSERT INTO pageviews (path, referrer, visitor, device) VALUES (?, ?, ?, ?)").run(
    safeDecode(path),
    referrer,
    visitor,
    device(ua),
  );
  return new Response(null, { status: 204 });
}
