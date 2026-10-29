import "server-only";
import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { randomBytes } from "node:crypto";
import { hashPassword } from "./password";
import { seedServices } from "@/data/services";
import { seedAreas } from "@/data/practiceAreas";
import { seedTeam } from "@/data/team";
import { seedGuides } from "@/data/guides";
import { seedFaq } from "@/data/faq";
import { seedProcessSteps, seedSite, seedTrustStats, seedValues } from "@/data/site";
import { collectionKeyField, type CollectionKey, type SiteSettings } from "./content/schema";

/**
 * قاعدة بيانات SQLite محلية (وحدة node:sqlite المدمجة في Node 22.13+).
 * المسار الافتراضي storage/alomari.db، ويمكن تغييره بالمتغير DATABASE_PATH.
 */
const DB_PATH = process.env.DATABASE_PATH ?? join(process.cwd(), "storage", "alomari.db");

const store = globalThis as unknown as { __alomariDb?: DatabaseSync };

export function db() {
  store.__alomariDb ??= open();
  return store.__alomariDb;
}

/** ينفّذ fn داخل معاملة كتابة واحدة */
export function tx<T>(fn: (d: DatabaseSync) => T): T {
  const d = db();
  d.exec("BEGIN IMMEDIATE");
  try {
    const out = fn(d);
    d.exec("COMMIT");
    return out;
  } catch (e) {
    d.exec("ROLLBACK");
    throw e;
  }
}

const migrations: string[] = [
  `
  CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'editor')),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    last_login_at TEXT
  );
  CREATE TABLE sessions (
    token_hash TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE content (
    id INTEGER PRIMARY KEY,
    collection TEXT NOT NULL,
    key TEXT NOT NULL,
    position INTEGER NOT NULL DEFAULT 0,
    data TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE (collection, key)
  );
  CREATE TABLE settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE requests (
    id INTEGER PRIMARY KEY,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    applicant_type TEXT NOT NULL,
    case_type TEXT NOT NULL,
    service TEXT NOT NULL,
    urgency TEXT NOT NULL,
    details TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    city TEXT NOT NULL,
    contact_method TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new',
    notes TEXT NOT NULL DEFAULT '',
    assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
    demo INTEGER NOT NULL DEFAULT 0
  );
  CREATE INDEX requests_created ON requests(created_at);
  CREATE INDEX requests_status ON requests(status);
  CREATE TABLE pageviews (
    id INTEGER PRIMARY KEY,
    ts TEXT NOT NULL DEFAULT (datetime('now')),
    path TEXT NOT NULL,
    referrer TEXT,
    visitor TEXT NOT NULL,
    device TEXT NOT NULL,
    demo INTEGER NOT NULL DEFAULT 0
  );
  CREATE INDEX pageviews_ts ON pageviews(ts);
  `,
];

function open() {
  mkdirSync(dirname(DB_PATH), { recursive: true });
  const d = new DatabaseSync(DB_PATH);
  d.exec("PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000; PRAGMA foreign_keys = ON;");

  d.exec("BEGIN IMMEDIATE");
  try {
    const { user_version } = d.prepare("PRAGMA user_version").get() as { user_version: number };
    for (let v = user_version; v < migrations.length; v++) d.exec(migrations[v]);
    d.exec(`PRAGMA user_version = ${migrations.length}`);
    seed(d);
    d.exec("COMMIT");
  } catch (e) {
    d.exec("ROLLBACK");
    throw e;
  }
  return d;
}

function seed(d: DatabaseSync) {
  const hasContent = d.prepare("SELECT 1 FROM content LIMIT 1").get();
  if (!hasContent) {
    const insert = d.prepare("INSERT INTO content (collection, key, position, data) VALUES (?, ?, ?, ?)");
    const add = (collection: CollectionKey, docs: object[]) =>
      docs.forEach((doc, i) =>
        insert.run(collection, String((doc as Record<string, unknown>)[collectionKeyField[collection]]), i, JSON.stringify(doc)),
      );
    add("services", seedServices);
    add("areas", seedAreas);
    add("team", seedTeam);
    add("guides", seedGuides);
    add("faq", seedFaq);
  }

  if (!d.prepare("SELECT 1 FROM settings WHERE key = 'site'").get()) {
    const site: SiteSettings = {
      ...structuredClone(seedSite),
      contact: { ...seedSite.contact, hours: seedSite.contact.hours.map((h) => ({ ...h })) },
      trustStats: seedTrustStats,
      values: seedValues,
      processSteps: seedProcessSteps,
    };
    d.prepare("INSERT INTO settings (key, value) VALUES ('site', ?)").run(JSON.stringify(site));
  }

  // ملح يومي لإخفاء هوية الزوار في الإحصاءات
  if (!d.prepare("SELECT 1 FROM settings WHERE key = 'analytics_salt'").get()) {
    d.prepare("INSERT INTO settings (key, value) VALUES ('analytics_salt', ?)").run(randomBytes(24).toString("hex"));
  }

  // أول مدير: من متغيرات البيئة ADMIN_EMAIL و ADMIN_PASSWORD
  const hasUsers = d.prepare("SELECT 1 FROM users LIMIT 1").get();
  const email = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD;
  if (!hasUsers && email && password) {
    d.prepare("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'admin')").run(
      process.env.ADMIN_NAME?.trim() || "مدير الموقع",
      email,
      hashPassword(password),
    );
  } else if (!hasUsers) {
    console.warn("[alomari] لا يوجد مستخدمون. اضبط ADMIN_EMAIL و ADMIN_PASSWORD لإنشاء أول مدير.");
  }
}
