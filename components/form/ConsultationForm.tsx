"use client";

import { useRef, useState, type ReactNode } from "react";
import { useForm, type FieldError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Copy, Pencil, ShieldCheck } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/lenis-store";
import { buildConsultationMessage, whatsappUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { practiceAreas, tracks } from "@/data/practiceAreas";
import { services } from "@/data/services";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import {
  OTHER,
  applicantTypes,
  consultationSchema,
  contactMethods,
  urgencies,
  type ConsultationInput,
  type ConsultationValues,
} from "./schema";

type Props = { defaultService?: string; defaultArea?: string };

const inputCls =
  "w-full border border-ink/20 bg-paper px-4 py-3.5 text-base transition-colors duration-300 placeholder:text-muted/60 hover:border-ink/40 focus:border-clay focus:outline-none aria-[invalid=true]:border-clay";

function Field({
  id,
  label,
  error,
  hint,
  children,
  className,
}: {
  id: string;
  label: string;
  error?: FieldError;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="text-xs text-muted">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm font-medium text-clay">
          {error.message}
        </p>
      )}
    </div>
  );
}

function Choice({
  name,
  legend,
  options,
  error,
  register,
}: {
  name: "applicantType" | "urgency" | "contactMethod";
  legend: string;
  options: readonly string[];
  error?: FieldError;
  register: ReturnType<typeof useForm<ConsultationInput, unknown, ConsultationValues>>["register"];
}) {
  return (
    <fieldset className="flex flex-col gap-2" aria-invalid={!!error} aria-describedby={error ? `${name}-error` : undefined}>
      <legend className="mb-2 text-sm font-semibold">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o} className="relative cursor-pointer">
            <input type="radio" value={o} {...register(name)} className="peer sr-only" />
            <span className="inline-flex border border-ink/20 px-4 py-2.5 text-sm font-medium transition-colors duration-300 peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-clay hover:border-ink/50">
              {o}
            </span>
          </label>
        ))}
      </div>
      {error && (
        <p id={`${name}-error`} role="alert" className="text-sm font-medium text-clay">
          {error.message}
        </p>
      )}
    </fieldset>
  );
}

export function ConsultationForm({ defaultService, defaultArea }: Props) {
  const area = practiceAreas.find((a) => a.slug === defaultArea);
  const service = services.find((s) => s.slug === defaultService);
  const [message, setMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ConsultationInput, unknown, ConsultationValues>({
    resolver: zodResolver(consultationSchema),
    mode: "onTouched",
    defaultValues: {
      applicantType: area ? (area.track === "companies" ? applicantTypes[1] : applicantTypes[0]) : undefined,
      caseType: area?.title ?? "",
      service: service?.title ?? "",
      urgency: urgencies[0],
      details: "",
      name: "",
      phone: "",
      city: "",
      contactMethod: contactMethods[0],
    },
  });

  const detailsLength = (watch("details") ?? "").length;

  const onValid = (v: ConsultationValues) => {
    setCopied(false);
    setMessage(buildConsultationMessage(v));
  };

  const onInvalid = () => {
    const first = root.current?.querySelector<HTMLElement>("[aria-invalid='true']");
    if (first) {
      scrollToTarget(first, { offset: -140 });
      (first.matches("fieldset") ? first.querySelector("input") : first)?.focus({ preventScroll: true });
    }
  };

  // انتقال بين النموذج ومراجعة الرسالة
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from("[data-step]", { opacity: 0, y: 24, duration: 0.7, clearProps: "all" });
    },
    { scope: root, dependencies: [message !== null], revertOnUpdate: false },
  );

  const copy = async () => {
    if (!message) return;
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const describe = (name: keyof ConsultationInput, hint = false) =>
    errors[name] ? `${name}-error` : hint ? `${name}-hint` : undefined;

  return (
    <div ref={root}>
      {message ? (
        <div data-step className="border border-ink/15 bg-paper p-6 md:p-10" aria-live="polite">
          <span className="eyebrow">الخطوة الأخيرة</span>
          <h2 className="mt-3 text-2xl md:text-3xl">رسالتك جاهزة للإرسال</h2>
          <p className="mt-3 leading-relaxed text-muted">
            راجع نص الرسالة، ثم اضغط «إرسال عبر واتساب». سيفتح واتساب بالرسالة جاهزة، وترسلها أنت بنفسك.
          </p>
          <pre className="mt-6 max-h-96 overflow-auto border-s-2 border-clay bg-sand/60 p-5 font-sans text-sm leading-loose whitespace-pre-wrap" data-lenis-prevent>
            {message}
          </pre>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              <WhatsAppIcon className="size-5" />
              إرسال عبر واتساب
            </a>
            <button type="button" onClick={copy} className="btn btn-outline cursor-pointer">
              {copied ? <Check className="size-4.5" aria-hidden="true" /> : <Copy className="size-4.5" aria-hidden="true" />}
              {copied ? "تم النسخ" : "نسخ الرسالة"}
            </button>
            <button type="button" onClick={() => setMessage(null)} className="btn btn-outline cursor-pointer">
              <Pencil className="size-4.5" aria-hidden="true" />
              تعديل الطلب
            </button>
          </div>
        </div>
      ) : (
        <form data-step noValidate onSubmit={handleSubmit(onValid, onInvalid)} className="grid gap-10">
          <section className="grid gap-7" aria-labelledby="sec-case">
            <h2 id="sec-case" className="flex items-center gap-3 text-xl">
              <span className="grid size-8 place-items-center bg-ink font-sans text-sm text-paper">1</span>
              عن طلبك
            </h2>
            <Choice name="applicantType" legend="الصفة" options={applicantTypes} error={errors.applicantType} register={register} />
            <div className="grid gap-7 md:grid-cols-2">
              <Field id="caseType" label="نوع القضية" error={errors.caseType}>
                <select
                  id="caseType"
                  {...register("caseType")}
                  aria-invalid={!!errors.caseType}
                  aria-describedby={describe("caseType")}
                  className={cn(inputCls, "cursor-pointer")}
                >
                  <option value="" disabled>
                    اختر نوع القضية
                  </option>
                  {(["individuals", "companies"] as const).map((t) => (
                    <optgroup key={t} label={tracks[t].title}>
                      {practiceAreas
                        .filter((a) => a.track === t)
                        .map((a) => (
                          <option key={a.slug} value={a.title}>
                            {a.title}
                          </option>
                        ))}
                    </optgroup>
                  ))}
                  <option value={OTHER}>{OTHER}</option>
                </select>
              </Field>
              <Field id="service" label="نوع الطلب" error={errors.service}>
                <select
                  id="service"
                  {...register("service")}
                  aria-invalid={!!errors.service}
                  aria-describedby={describe("service")}
                  className={cn(inputCls, "cursor-pointer")}
                >
                  <option value="" disabled>
                    اختر نوع الطلب
                  </option>
                  {services.map((s) => (
                    <option key={s.slug} value={s.title}>
                      {s.title}
                    </option>
                  ))}
                  <option value={OTHER}>{OTHER}</option>
                </select>
              </Field>
            </div>
            <Choice name="urgency" legend="مدى الاستعجال" options={urgencies} error={errors.urgency} register={register} />
            <Field
              id="details"
              label="وصف مختصر لموضوعك"
              error={errors.details}
              hint="اذكر الوقائع الأساسية والتواريخ المهمة وما تريد الوصول إليه. لا ترسل مستندات هنا."
            >
              <textarea
                id="details"
                rows={6}
                {...register("details")}
                aria-invalid={!!errors.details}
                aria-describedby={describe("details", true)}
                className={cn(inputCls, "resize-y leading-relaxed")}
                placeholder="مثال: أُنهي عقد عملي قبل شهرين دون إشعار، ولم أستلم مستحقاتي حتى الآن…"
              />
              <span className="self-end text-xs text-muted tabular-nums" aria-hidden="true">
                {detailsLength} / 1500
              </span>
            </Field>
          </section>

          <section className="grid gap-7" aria-labelledby="sec-contact">
            <h2 id="sec-contact" className="flex items-center gap-3 text-xl">
              <span className="grid size-8 place-items-center bg-ink font-sans text-sm text-paper">2</span>
              بيانات التواصل
            </h2>
            <div className="grid gap-7 md:grid-cols-2">
              <Field id="name" label="الاسم" error={errors.name}>
                <input
                  id="name"
                  autoComplete="name"
                  {...register("name")}
                  aria-invalid={!!errors.name}
                  aria-describedby={describe("name")}
                  className={inputCls}
                />
              </Field>
              <Field id="phone" label="رقم الجوال" error={errors.phone}>
                <input
                  id="phone"
                  type="tel"
                  dir="ltr"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="05XXXXXXXX"
                  {...register("phone")}
                  aria-invalid={!!errors.phone}
                  aria-describedby={describe("phone")}
                  className={cn(inputCls, "text-end")}
                />
              </Field>
              <Field id="city" label="المدينة" error={errors.city}>
                <input
                  id="city"
                  autoComplete="address-level2"
                  {...register("city")}
                  aria-invalid={!!errors.city}
                  aria-describedby={describe("city")}
                  className={inputCls}
                />
              </Field>
            </div>
            <Choice
              name="contactMethod"
              legend="طريقة التواصل المفضلة"
              options={contactMethods}
              error={errors.contactMethod}
              register={register}
            />
          </section>

          <div className="grid gap-6 border-t border-ink/15 pt-8">
            <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed">
              <input
                type="checkbox"
                {...register("consent")}
                aria-invalid={!!errors.consent}
                aria-describedby={describe("consent")}
                className="mt-1 size-4.5 shrink-0 cursor-pointer accent-clay"
              />
              <span>
                أقرّ بأن إرسال الطلب لا يُعد توكيلًا ولا ينشئ علاقة محامٍ وموكل، وأن الرسوم تُحدد بعد دراسة الطلب.
              </span>
            </label>
            {errors.consent && (
              <p id="consent-error" role="alert" className="-mt-3 text-sm font-medium text-clay">
                {errors.consent.message}
              </p>
            )}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="inline-flex items-center gap-2 text-sm text-muted">
                <ShieldCheck className="size-4.5 text-clay" aria-hidden="true" />
                لا تُحفظ بياناتك في الموقع؛ تُجهَّز في رسالة ترسلها أنت.
              </p>
              <button type="submit" disabled={isSubmitting} className="btn btn-primary cursor-pointer disabled:opacity-60">
                <WhatsAppIcon className="size-5" />
                تجهيز الرسالة
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
