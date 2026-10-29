/**
 * بيانات تجريبية لعرض لوحة التحكم (زيارات وطلبات لآخر 60 يومًا).
 * كل ما يُنشأ هنا معلَّم demo = 1 ويُحذف بالكامل بـ: npm run demo:clear
 *
 *   npm run demo:seed   — إضافة البيانات التجريبية
 *   npm run demo:clear  — حذفها
 */
import { DatabaseSync } from "node:sqlite";
import { existsSync } from "node:fs";
import { join } from "node:path";

const path = process.env.DATABASE_PATH ?? join(process.cwd(), "storage", "alomari.db");
if (!existsSync(path)) {
  console.error(`قاعدة البيانات غير موجودة (${path}). شغّل الموقع مرة واحدة أولًا (npm run build أو npm run dev).`);
  process.exit(1);
}
const db = new DatabaseSync(path);
db.exec("PRAGMA busy_timeout = 5000");

const cmd = process.argv[2];
if (cmd === "clear") {
  const r = db.prepare("DELETE FROM requests WHERE demo = 1").run();
  const p = db.prepare("DELETE FROM pageviews WHERE demo = 1").run();
  console.log(`حُذفت ${r.changes} طلبات و ${p.changes} زيارة تجريبية.`);
  process.exit(0);
}
if (cmd !== "seed") {
  console.log("الاستخدام: node scripts/demo-data.mjs seed|clear");
  process.exit(1);
}

let seed = 42;
const rand = () => ((seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const weighted = (pairs) => {
  const total = pairs.reduce((s, [, w]) => s + w, 0);
  let x = rand() * total;
  for (const [v, w] of pairs) if ((x -= w) <= 0) return v;
  return pairs[0][0];
};

const content = (col) =>
  db.prepare("SELECT data FROM content WHERE collection = ? ORDER BY position").all(col).map((r) => JSON.parse(r.data));
const areas = content("areas");
const services = content("services");
const guides = content("guides");

const pages = [
  ["/", 30],
  ["/consultation", 12],
  ["/services", 9],
  ["/practice-areas", 7],
  ["/contact", 6],
  ["/about", 5],
  ["/team", 3],
  ["/faq", 4],
  ["/guides", 3],
  ...areas.map((a, i) => [`/practice-areas/${a.slug}`, Math.max(1, 5 - i * 0.4)]),
  ...guides.map((g, i) => [`/guides/${g.slug}`, 4 - i]),
];
const referrers = [[null, 45], ["google.com", 35], ["instagram.com", 7], ["x.com", 5], ["linkedin.com", 3], ["bing.com", 2], ["snapchat.com", 3]];
const devicesW = [["mobile", 68], ["desktop", 28], ["tablet", 4]];

const insertView = db.prepare("INSERT INTO pageviews (ts, path, referrer, visitor, device, demo) VALUES (?, ?, ?, ?, ?, 1)");
const insertReq = db.prepare(
  `INSERT INTO requests (created_at, updated_at, applicant_type, case_type, service, urgency, details, name, phone, city, contact_method, status, notes, demo)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
);

const names = ["محمد العتيبي", "سارة القحطاني", "عبدالله الشهري", "نورة الدوسري", "خالد الغامدي", "ريم الحربي", "فهد المطيري", "هند الزهراني", "سلطان العنزي", "أمل السبيعي", "شركة رواسي للتجارة", "مؤسسة أفق الرقمية", "تركي الشمري", "لمى البقمي", "ماجد الرشيدي"];
const cities = [["الرياض", 50], ["جدة", 18], ["الدمام", 10], ["مكة المكرمة", 6], ["المدينة المنورة", 5], ["الخبر", 5], ["أبها", 3], ["بريدة", 3]];
const details = {
  labor: "أُنهي عقد عملي دون سبب مشروع قبل شهر ولم أستلم مكافأة نهاية الخدمة ولا الأجور المتأخرة.",
  "personal-status": "أرغب في رفع دعوى حضانة ونفقة للأطفال بعد الطلاق، والطرف الآخر يرفض الاتفاق ودياً.",
  "real-estate": "المستأجر متأخر عن سداد الإيجار منذ ستة أشهر وأرغب في الإخلاء والمطالبة بالمتأخرات.",
  inheritance: "توفي والدنا ونحتاج إلى استكمال حصر الورثة وقسمة التركة، وبيننا خلاف حول إدارة العقارات.",
  criminal: "تعرضت لاحتيال مالي عبر متجر إلكتروني وأرغب في تقديم بلاغ والمطالبة بالحق الخاص.",
  enforcement: "لدي حكم نهائي بمبلغ مالي ولم ينفذه المدين، وأحتاج إلى متابعة طلب التنفيذ.",
  "company-formation": "نرغب في تأسيس شركة ذات مسؤولية محدودة بين ثلاثة شركاء وصياغة اتفاقية الشركاء.",
  contracts: "لدينا عقد توريد مع جهة حكومية ونحتاج إلى مراجعته قبل التوقيع خلال أسبوع.",
  commercial: "عميل لم يسدد فواتير مستحقة منذ عام رغم المطالبات، والمبلغ كبير ونرغب في المطالبة قضائياً.",
  "foreign-investment": "مستثمر أجنبي يرغب في دخول السوق السعودي بنشاط تقني ويحتاج إلى معرفة متطلبات الترخيص.",
  arbitration: "نشأ خلاف مع شريك تجاري والعقد يتضمن شرط تحكيم، ونحتاج إلى تقييم موقفنا.",
  "intellectual-property": "اكتشفنا متجراً يستخدم علامتنا التجارية المسجلة دون إذن ونرغب في اتخاذ إجراء.",
};
const statusesByAge = (age) =>
  age < 2 ? [["new", 80], ["in_review", 20]] : age < 10 ? [["in_review", 35], ["contacted", 40], ["new", 10], ["closed", 15]] : [["closed", 55], ["contacted", 35], ["in_review", 5], ["spam", 5]];

const ts = (daysAgo, hour, min) => {
  const d = new Date(Date.now() - daysAgo * 86400000);
  d.setUTCHours(hour - 3, min, Math.floor(rand() * 60), 0); // ساعة الرياض → UTC
  return d.toISOString().replace("T", " ").slice(0, 19);
};

db.exec("BEGIN");
let views = 0;
let reqs = 0;
for (let ago = 59; ago >= 0; ago--) {
  const weekday = new Date(Date.now() - ago * 86400000).getUTCDay();
  const weekend = weekday === 5 || weekday === 6;
  const growth = 1 + (59 - ago) / 80;
  const visitors = Math.round((weekend ? 18 : 30) * growth + rand() * 14);
  for (let v = 0; v < visitors; v++) {
    const visitor = `demo${ago}-${v}`;
    const device = weighted(devicesW);
    const ref = weighted(referrers);
    const hour = Math.floor(8 + rand() * 15);
    const depth = 1 + Math.floor(rand() * rand() * 5);
    for (let p = 0; p < depth; p++) {
      insertView.run(ts(ago, hour, Math.min(59, p * 3 + Math.floor(rand() * 3))), weighted(pages), p === 0 ? ref : null, visitor, device);
      views++;
    }
  }
  const dayReqs = Math.floor(rand() * (weekend ? 1.6 : 3.2) * growth);
  for (let r = 0; r < dayReqs; r++) {
    const area = weighted(areas.map((a, i) => [a, 12 - i]));
    const company = area.track === "companies";
    const created = ts(ago, Math.floor(9 + rand() * 12), Math.floor(rand() * 60));
    insertReq.run(
      created,
      created,
      company ? "شركة / منشأة" : "فرد",
      area.title,
      weighted(services.map((s, i) => [s.title, i === 0 ? 10 : 6 - i])),
      weighted([["عادي", 60], ["خلال أسبوع", 28], ["عاجل (جلسة أو مهلة قريبة)", 12]]),
      details[area.slug] ?? "أرغب في استشارة قانونية بخصوص موضوع أحتاج فيه إلى رأي محامٍ مختص.",
      company ? pick(names.filter((n) => n.startsWith("شركة") || n.startsWith("مؤسسة"))) : pick(names.filter((n) => !n.startsWith("شركة") && !n.startsWith("مؤسسة"))),
      `05${Math.floor(10000000 + rand() * 89999999)}`,
      weighted(cities),
      weighted([["واتساب", 75], ["اتصال هاتفي", 25]]),
      weighted(statusesByAge(ago)),
      "",
    );
    reqs++;
  }
}
db.exec("COMMIT");
console.log(`أُضيفت ${views} زيارة و ${reqs} طلبًا تجريبيًا. لحذفها: npm run demo:clear`);
