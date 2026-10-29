"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { collectionKeyField, collectionSchemas, siteSettingsSchema, type CollectionDoc } from "@/lib/content/schema";
import { isCollection } from "@/lib/content/collections";
import { deleteDoc, moveDoc, saveDoc, saveSettings } from "@/lib/content/store";
import { cleanInput, issuesToMap, type SaveResult } from "@/lib/content/clean";

const INVALID = "راجع الحقول المظللة ثم أعد الحفظ.";

/** إعادة توليد صفحات الموقع العام بعد أي تعديل في المحتوى */
function refreshSite() {
  revalidatePath("/", "layout");
}

export async function saveContent(collection: string, id: number | null, data: unknown): Promise<SaveResult> {
  const user = await requireUser();
  if (!isCollection(collection)) return { ok: false, message: "مجموعة غير معروفة", errors: {} };

  const parsed = collectionSchemas[collection].safeParse(cleanInput(data));
  if (!parsed.success) return { ok: false, message: INVALID, errors: issuesToMap(parsed.error.issues) };

  const savedId = saveDoc(collection, id, parsed.data as CollectionDoc[typeof collection], user.id);
  if (savedId === null) {
    return {
      ok: false,
      message: INVALID,
      errors: { [collectionKeyField[collection]]: "هذا المعرّف مستخدم في عنصر آخر" },
    };
  }
  refreshSite();
  return { ok: true, id: savedId };
}

export async function deleteContent(collection: string, id: number) {
  await requireUser();
  if (!isCollection(collection)) return;
  deleteDoc(collection, id);
  refreshSite();
  redirect(`/admin/content/${collection}?deleted=1`);
}

export async function moveContent(collection: string, id: number, dir: -1 | 1) {
  await requireUser();
  if (!isCollection(collection)) return;
  moveDoc(collection, id, dir);
  refreshSite();
  revalidatePath(`/admin/content/${collection}`);
}

export async function saveSiteSettings(data: unknown): Promise<SaveResult> {
  await requireUser("admin");
  const parsed = siteSettingsSchema.safeParse(cleanInput(data));
  if (!parsed.success) return { ok: false, message: INVALID, errors: issuesToMap(parsed.error.issues) };
  saveSettings(parsed.data);
  refreshSite();
  return { ok: true };
}
