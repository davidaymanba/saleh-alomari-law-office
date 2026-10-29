import "server-only";
import { db, tx } from "@/lib/db";
import {
  collectionKeyField,
  type CollectionDoc,
  type CollectionKey,
  type SiteSettings,
} from "./schema";

export type DocRow<K extends CollectionKey> = {
  id: number;
  key: string;
  position: number;
  data: CollectionDoc[K];
  updatedAt: string;
  updatedBy: string | null;
};

type RawRow = { id: number; key: string; position: number; data: string; updated_at: string; updated_by_name: string | null };

const SELECT = `
  SELECT c.id, c.key, c.position, c.data, c.updated_at, u.name AS updated_by_name
  FROM content c LEFT JOIN users u ON u.id = c.updated_by`;

function toRow<K extends CollectionKey>(r: RawRow): DocRow<K> {
  return {
    id: r.id,
    key: r.key,
    position: r.position,
    data: JSON.parse(r.data),
    updatedAt: r.updated_at,
    updatedBy: r.updated_by_name,
  };
}

export function listDocs<K extends CollectionKey>(collection: K): DocRow<K>[] {
  const rows = db().prepare(`${SELECT} WHERE c.collection = ? ORDER BY c.position, c.id`).all(collection) as RawRow[];
  return rows.map((r) => toRow<K>(r));
}

export function getDoc<K extends CollectionKey>(collection: K, id: number): DocRow<K> | null {
  const r = db().prepare(`${SELECT} WHERE c.collection = ? AND c.id = ?`).get(collection, id) as RawRow | undefined;
  return r ? toRow<K>(r) : null;
}

export function countDocs(collection: CollectionKey) {
  return (db().prepare("SELECT COUNT(*) AS n FROM content WHERE collection = ?").get(collection) as { n: number }).n;
}

/** يحفظ مستندًا (جديدًا إن لم يُمرَّر id). يعيد null عند تكرار المعرّف. */
export function saveDoc<K extends CollectionKey>(
  collection: K,
  id: number | null,
  data: CollectionDoc[K],
  userId: number,
): number | null {
  const key = String((data as Record<string, unknown>)[collectionKeyField[collection]]);
  return tx((d) => {
    const clash = d
      .prepare("SELECT id FROM content WHERE collection = ? AND key = ? AND id IS NOT ?")
      .get(collection, key, id) as { id: number } | undefined;
    if (clash) return null;
    if (id) {
      d.prepare(
        "UPDATE content SET key = ?, data = ?, updated_at = datetime('now'), updated_by = ? WHERE id = ? AND collection = ?",
      ).run(key, JSON.stringify(data), userId, id, collection);
      return id;
    }
    const { pos } = d
      .prepare("SELECT COALESCE(MAX(position), -1) + 1 AS pos FROM content WHERE collection = ?")
      .get(collection) as { pos: number };
    const res = d
      .prepare("INSERT INTO content (collection, key, position, data, updated_by) VALUES (?, ?, ?, ?, ?)")
      .run(collection, key, pos, JSON.stringify(data), userId);
    return Number(res.lastInsertRowid);
  });
}

export function deleteDoc(collection: CollectionKey, id: number) {
  db().prepare("DELETE FROM content WHERE collection = ? AND id = ?").run(collection, id);
}

/** يبدّل ترتيب المستند مع جاره (dir: -1 للأعلى، 1 للأسفل) */
export function moveDoc(collection: CollectionKey, id: number, dir: -1 | 1) {
  tx((d) => {
    const ids = (d.prepare("SELECT id FROM content WHERE collection = ? ORDER BY position, id").all(collection) as { id: number }[]).map(
      (r) => r.id,
    );
    const i = ids.indexOf(id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j], ids[i]];
    const upd = d.prepare("UPDATE content SET position = ? WHERE id = ?");
    ids.forEach((docId, pos) => upd.run(pos, docId));
  });
}

export function getSettings(): SiteSettings {
  const r = db().prepare("SELECT value FROM settings WHERE key = 'site'").get() as { value: string };
  return JSON.parse(r.value);
}

export function saveSettings(settings: SiteSettings) {
  db()
    .prepare("UPDATE settings SET value = ?, updated_at = datetime('now') WHERE key = 'site'")
    .run(JSON.stringify(settings));
}
