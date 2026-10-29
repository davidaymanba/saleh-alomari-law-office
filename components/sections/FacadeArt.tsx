/**
 * واجهة نجدية مرسومة بخطوط: جدار بشُرفات، فتحات تهوية مثلثة، نوافذ وباب.
 * .facade-line تُرسم بـ DrawSVG، و .facade-fill تظهر بعدها، و [data-depth] للبارالاكس.
 */
const tri = (x: number, base: number, w: number, h: number) =>
  `M${x} ${base}L${x + w / 2} ${base - h}L${x + w} ${base}`;

const crenels = (x0: number, count: number, w: number, base: number, h: number) =>
  Array.from({ length: count }, (_, i) => `L${x0 + i * w + w / 2} ${base - h}L${x0 + (i + 1) * w} ${base}`).join("");

const wall = `M60 600V170${crenels(60, 10, 40, 170, 36)}V600`;
const tower = `M330 170V64${crenels(330, 5, 34, 64, 30)}V170`;
const vents = Array.from({ length: 9 }, (_, i) => `${tri(84 + i * 40, 258, 16, 16)}Z`).join("");
const lowVents = Array.from({ length: 3 }, (_, i) => `${tri(226 + i * 24, 316, 12, 12)}Z`).join("");

export function FacadeArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 520 620" className={className} aria-hidden="true" fill="none">
      <defs>
        <pattern id="mud" width="10" height="10" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="0.9" fill="currentColor" opacity="0.14" />
        </pattern>
      </defs>

      {/* القمر */}
      <g data-depth="3">
        <circle className="facade-fill" cx="128" cy="84" r="30" style={{ fill: "var(--color-sand-2)" }} />
        <circle className="facade-line" cx="128" cy="84" r="30" style={{ stroke: "var(--color-clay)" }} strokeWidth="1.5" />
      </g>

      {/* البرج الخلفي */}
      <g data-depth="1.5">
        <path className="facade-fill" d={`${tower}Z`} style={{ fill: "var(--color-sand-2)" }} />
        <path className="facade-line" d={tower} stroke="currentColor" strokeWidth="1.5" />
        <path className="facade-line" d="M405 150V112L415 98L425 112V150" stroke="currentColor" strokeWidth="1.5" />
        <path className="facade-line" d="M330 90H500" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      </g>

      {/* الجدار الرئيسي */}
      <g>
        <path className="facade-fill" d={`${wall}Z`} style={{ fill: "var(--color-sand)" }} />
        <path className="facade-fill" d={`${wall}Z`} fill="url(#mud)" />
        <path className="facade-line" d={wall} stroke="currentColor" strokeWidth="2" />
        <path className="facade-line" d="M60 196H460M60 206H460" stroke="currentColor" strokeWidth="1.2" />
        <path className="facade-line" d={vents} style={{ stroke: "var(--color-clay)" }} strokeWidth="1.5" />

        {/* النوافذ */}
        <path className="facade-fill" d="M100 330H160V400H100Z M360 330H420V400H360Z" style={{ fill: "var(--color-ink-2)" }} opacity="0.9" />
        <path className="facade-line" d="M92 322H168V408H92Z M352 322H428V408H352Z" stroke="currentColor" strokeWidth="1.5" />
        <path className="facade-line" d={`${tri(108, 392, 44, 40)}M130 392V352 ${tri(368, 392, 44, 40)}M390 392V352`} style={{ stroke: "var(--color-clay-soft)" }} strokeWidth="1.2" />

        {/* الباب */}
        <path className="facade-line" d={lowVents} style={{ stroke: "var(--color-clay)" }} strokeWidth="1.3" />
        <path className="facade-fill" d="M216 600V420L260 378L304 420V600Z" style={{ fill: "var(--color-clay)" }} />
        <path className="facade-line" d="M196 600V408L260 350L324 408V600" stroke="currentColor" strokeWidth="2" />
        <path className="facade-line" d="M216 600V420L260 378L304 420V600" stroke="currentColor" strokeWidth="1.5" />
        <path className="facade-line" d="M260 430V600M236 460H244M276 460H284M236 540H244M276 540H284" style={{ stroke: "var(--color-paper)" }} strokeWidth="1.5" />

        <path className="facade-line" d="M60 560H196M324 560H460" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      </g>

      <path className="facade-line" d="M0 600H520" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
