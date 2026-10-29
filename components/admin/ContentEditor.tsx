"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Check, Plus, Trash2 } from "lucide-react";
import type { FieldDef } from "@/lib/content/fields";
import type { SaveResult } from "@/lib/content/clean";
import { cn } from "@/lib/utils";

type Value = Record<string, unknown>;
type Path = (string | number)[];

function getIn(obj: unknown, path: Path): unknown {
  return path.reduce<unknown>((o, k) => (o == null ? undefined : (o as Record<string | number, unknown>)[k]), obj);
}

function setIn(obj: unknown, path: Path, value: unknown): unknown {
  if (!path.length) return value;
  const [k, ...rest] = path;
  if (Array.isArray(obj)) {
    const copy = [...obj];
    copy[k as number] = setIn(copy[k as number], rest, value);
    return copy;
  }
  const o = (obj ?? {}) as Record<string, unknown>;
  return { ...o, [k]: setIn(o[k as string], rest, value) };
}

/** "contact.hours" + ["0","days"] → مسار */
const join = (base: Path, name: string): Path => (name ? [...base, ...name.split(".")] : base);
const keyOf = (p: Path) => p.join(".");

type Ctx = {
  value: Value;
  errors: Record<string, string>;
  set: (p: Path, v: unknown) => void;
};

function Label({ id, children, hint, error }: { id?: string; children: string; hint?: string; error?: string }) {
  return (
    <>
      <label htmlFor={id} className="text-sm font-semibold">
        {children}
      </label>
      {hint && <p className="-mt-1 text-xs text-muted">{hint}</p>}
      {error && (
        <p role="alert" className="order-last text-xs font-semibold text-[#d92d20] dark:text-[#f97066]">
          {error}
        </p>
      )}
    </>
  );
}

function Field({ def, base, ctx }: { def: FieldDef; base: Path; ctx: Ctx }) {
  const path = join(base, def.name);
  const id = `f-${keyOf(path)}`;
  const raw = getIn(ctx.value, path);
  const error = ctx.errors[keyOf(path)];
  const wide = !("half" in def && def.half);

  switch (def.type) {
    case "text":
    case "date":
      return (
        <div className={cn("flex flex-col gap-1.5", wide && "md:col-span-2")}>
          <Label id={id} hint={def.type === "text" ? def.hint : undefined} error={error}>
            {def.label}
          </Label>
          <input
            id={id}
            type={def.type === "date" ? "date" : "text"}
            dir={def.type === "text" ? def.dir : "ltr"}
            value={raw == null ? "" : String(raw)}
            onChange={(e) => ctx.set(path, e.target.value)}
            aria-invalid={!!error}
            className={cn("ainput", def.type === "date" || (def.type === "text" && def.dir) ? "text-start" : "")}
          />
        </div>
      );
    case "textarea":
      return (
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <Label id={id} hint={def.hint} error={error}>
            {def.label}
          </Label>
          <textarea
            id={id}
            rows={def.rows ?? 3}
            value={String(raw ?? "")}
            onChange={(e) => ctx.set(path, e.target.value)}
            aria-invalid={!!error}
            className="ainput resize-y"
          />
        </div>
      );
    case "select":
      return (
        <div className={cn("flex flex-col gap-1.5", wide && "md:col-span-2")}>
          <Label id={id} hint={def.hint} error={error}>
            {def.label}
          </Label>
          <select
            id={id}
            value={String(raw ?? "")}
            onChange={(e) => ctx.set(path, e.target.value)}
            aria-invalid={!!error}
            className="ainput cursor-pointer"
          >
            {def.empty !== undefined && <option value="">{def.empty}</option>}
            {def.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      );
    case "lines": {
      const list = Array.isArray(raw) ? (raw as string[]) : [];
      return (
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <Label id={id} hint={def.hint} error={error}>
            {def.label}
          </Label>
          <textarea
            id={id}
            rows={Math.max(3, list.length + 1)}
            value={list.join("\n")}
            onChange={(e) => ctx.set(path, e.target.value.split("\n"))}
            aria-invalid={!!error}
            className="ainput resize-y"
          />
        </div>
      );
    }
    case "checkbox":
      return (
        <label className="flex cursor-pointer items-start gap-3 md:col-span-2">
          <input
            type="checkbox"
            checked={!!raw}
            onChange={(e) => ctx.set(path, e.target.checked)}
            className="mt-1 size-4 cursor-pointer accent-gold"
          />
          <span className="flex flex-col">
            <span className="text-sm font-semibold">{def.label}</span>
            {def.hint && <span className="text-xs text-muted">{def.hint}</span>}
          </span>
        </label>
      );
    case "object":
      return (
        <fieldset className="grid gap-5 md:col-span-2 md:grid-cols-2">
          {def.fields.map((f) => (
            <Field key={f.name} def={f} base={path} ctx={ctx} />
          ))}
        </fieldset>
      );
    case "array": {
      const items = Array.isArray(raw) ? (raw as unknown[]) : [];
      const move = (i: number, d: number) => {
        const next = [...items];
        [next[i], next[i + d]] = [next[i + d], next[i]];
        ctx.set(path, next);
      };
      return (
        <div className="flex flex-col gap-3 md:col-span-2">
          <div>
            <p className="text-sm font-semibold">{def.label}</p>
            {def.hint && <p className="text-xs text-muted">{def.hint}</p>}
            {error && <p className="text-xs font-semibold text-[#d92d20] dark:text-[#f97066]">{error}</p>}
          </div>
          {items.map((_, i) => (
            <div key={i} className="border border-ink/12 bg-sand/30">
              <div className="flex items-center justify-between gap-2 border-b border-ink/10 px-4 py-2">
                <span className="text-xs font-semibold text-muted">
                  {def.itemLabel} {i + 1}
                </span>
                <span className="flex gap-1">
                  <button type="button" disabled={i === 0} onClick={() => move(i, -1)} className="abtn abtn-ghost abtn-sm" aria-label="تحريك للأعلى">
                    <ArrowUp className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={i === items.length - 1}
                    onClick={() => move(i, 1)}
                    className="abtn abtn-ghost abtn-sm"
                    aria-label="تحريك للأسفل"
                  >
                    <ArrowDown className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => ctx.set(path, items.filter((__, j) => j !== i))}
                    className="abtn abtn-danger abtn-sm"
                    aria-label={`حذف ${def.itemLabel}`}
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </span>
              </div>
              <div className="grid gap-5 p-4 md:grid-cols-2">
                {def.fields.map((f) => (
                  <Field key={f.name} def={f} base={[...path, i]} ctx={ctx} />
                ))}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => ctx.set(path, [...items, structuredClone(def.template)])}
            className="abtn abtn-ghost self-start border-dashed"
          >
            <Plus className="size-4" aria-hidden="true" />
            إضافة {def.itemLabel}
          </button>
        </div>
      );
    }
    case "blocks":
      return <BlocksField path={path} ctx={ctx} label={def.label} />;
  }
}

type Block = { type: "p" | "note" | "ul" | "ol"; text?: string; items?: string[] };

const blockTypes: { value: Block["type"]; label: string }[] = [
  { value: "p", label: "فقرة" },
  { value: "ul", label: "قائمة نقطية" },
  { value: "ol", label: "قائمة مرقمة" },
  { value: "note", label: "ملاحظة بارزة" },
];

/** محرر فقرات الدليل: الفقرات نص، والقوائم سطر لكل عنصر */
function BlocksField({ path, ctx, label }: { path: Path; ctx: Ctx; label: string }) {
  const blocks = (getIn(ctx.value, path) as Block[] | undefined) ?? [];
  const error = ctx.errors[keyOf(path)];
  const isList = (t: Block["type"]) => t === "ul" || t === "ol";
  const content = (b: Block) => (isList(b.type) ? (b.items ?? []).join("\n") : (b.text ?? ""));
  const update = (i: number, b: Block) => ctx.set(path, blocks.map((x, j) => (j === i ? b : x)));

  const changeType = (i: number, type: Block["type"]) => {
    const text = content(blocks[i]);
    update(i, isList(type) ? { type, items: text.split("\n") } : { type, text });
  };

  return (
    <div className="flex flex-col gap-3 md:col-span-2">
      <p className="text-sm font-semibold">{label}</p>
      {error && <p className="text-xs font-semibold text-[#d92d20] dark:text-[#f97066]">{error}</p>}
      {blocks.map((b, i) => {
        const err = ctx.errors[keyOf([...path, i, isList(b.type) ? "items" : "text"])];
        return (
          <div key={i} className="flex flex-col gap-2 border-s-2 border-gold/50 ps-3">
            <div className="flex items-center gap-2">
              <select
                value={b.type}
                onChange={(e) => changeType(i, e.target.value as Block["type"])}
                aria-label="نوع الفقرة"
                className="ainput w-auto cursor-pointer py-1.5 text-xs"
              >
                {blockTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              {isList(b.type) && <span className="text-xs text-muted">كل سطر عنصر</span>}
              <span className="flex-1" />
              <button
                type="button"
                disabled={i === 0}
                onClick={() => ctx.set(path, blocks.map((x, j) => (j === i - 1 ? blocks[i] : j === i ? blocks[i - 1] : x)))}
                className="abtn abtn-ghost abtn-sm"
                aria-label="تحريك للأعلى"
              >
                <ArrowUp className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => ctx.set(path, blocks.filter((_, j) => j !== i))}
                className="abtn abtn-danger abtn-sm"
                aria-label="حذف الفقرة"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
            <textarea
              rows={isList(b.type) ? Math.max(3, (b.items ?? []).length + 1) : 3}
              value={content(b)}
              onChange={(e) =>
                update(i, isList(b.type) ? { type: b.type, items: e.target.value.split("\n") } : { type: b.type, text: e.target.value })
              }
              aria-invalid={!!err}
              aria-label="المحتوى"
              className="ainput resize-y"
            />
            {err && <p className="text-xs font-semibold text-[#d92d20] dark:text-[#f97066]">{err}</p>}
          </div>
        );
      })}
      <button
        type="button"
        onClick={() => ctx.set(path, [...blocks, { type: "p", text: "" }])}
        className="abtn abtn-ghost abtn-sm self-start border-dashed"
      >
        <Plus className="size-3.5" aria-hidden="true" />
        إضافة فقرة
      </button>
    </div>
  );
}

export function ContentEditor({
  fields,
  initial,
  save,
  newBase,
  sections = false,
}: {
  fields: FieldDef[];
  initial: Value;
  /** إجراء الحفظ في الخادم */
  save: (data: Value) => Promise<SaveResult>;
  /** للعناصر الجديدة: ينتقل بعد الحفظ إلى `${newBase}/${id}` */
  newBase?: string;
  /** عرض الحقول العليا كبطاقات منفصلة (للإعدادات) */
  sections?: boolean;
}) {
  const router = useRouter();
  const [value, setValue] = useState<Value>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [dirty, setDirty] = useState(false);
  const [pending, start] = useTransition();

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const ctx: Ctx = {
    value,
    errors,
    set: (p, v) => {
      setValue((cur) => setIn(cur, p, v) as Value);
      setDirty(true);
      setStatus(null);
    },
  };

  const submit = () =>
    start(async () => {
      const res = await save(value);
      if (res.ok) {
        setErrors({});
        setDirty(false);
        setStatus({ tone: "ok", text: "تم الحفظ، والتعديلات ظاهرة الآن في الموقع." });
        if (newBase && res.id) router.replace(`${newBase}/${res.id}?saved=1`);
        else router.refresh();
      } else {
        setErrors(res.errors);
        setStatus({ tone: "error", text: res.message });
        requestAnimationFrame(() => document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus());
      }
    });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="grid gap-6"
    >
      {sections ? (
        fields.map((f) => (
          <section key={`${f.type}-${f.name}-${f.label}`} className="acard">
            <h2 className="border-b border-ink/10 px-5 py-3.5 font-sans text-[0.95rem] font-semibold">{f.label}</h2>
            <div className="grid gap-5 p-5 md:grid-cols-2">
              {f.type === "object" ? (
                f.fields.map((sf) => <Field key={sf.name} def={sf} base={join([], f.name)} ctx={ctx} />)
              ) : (
                <Field def={{ ...f, label: "" } as FieldDef} base={[]} ctx={ctx} />
              )}
            </div>
          </section>
        ))
      ) : (
        <div className="acard grid gap-6 p-5 md:grid-cols-2 md:p-6">
          {fields.map((f) => (
            <Field key={f.name} def={f} base={[]} ctx={ctx} />
          ))}
        </div>
      )}

      <div className="sticky bottom-0 z-10 -mx-4 flex flex-wrap items-center gap-3 border-t border-ink/10 bg-paper/95 px-4 py-3 backdrop-blur md:-mx-8 md:px-8">
        <button type="submit" disabled={pending} className="abtn abtn-primary min-w-28">
          {pending ? "جارٍ الحفظ…" : "حفظ"}
        </button>
        {status && (
          <p
            role="status"
            className={cn(
              "inline-flex items-center gap-2 text-sm",
              status.tone === "ok" ? "text-[#25643f] dark:text-[#7fd1a0]" : "font-semibold text-[#d92d20] dark:text-[#f97066]",
            )}
          >
            {status.tone === "ok" && <Check className="size-4" aria-hidden="true" />}
            {status.text}
          </p>
        )}
        {!status && dirty && <p className="text-sm text-muted">لديك تعديلات غير محفوظة</p>}
      </div>
    </form>
  );
}
