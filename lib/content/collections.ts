import { tracks, type CollectionDoc, type CollectionKey } from "./schema";

type Meta<K extends CollectionKey> = {
  label: string;
  singular: string;
  description: string;
  /** رابط المستند في الموقع العام */
  publicPath: (doc: CollectionDoc[K]) => string;
  title: (doc: CollectionDoc[K]) => string;
  subtitle: (doc: CollectionDoc[K]) => string;
  /** مستند فارغ لنموذج الإضافة */
  empty: () => Record<string, unknown>;
};

export const collectionMeta: { [K in CollectionKey]: Meta<K> } = {
  services: {
    label: "الخدمات",
    singular: "خدمة",
    description: "الخدمات القانونية المعروضة في الرئيسية وصفحة الخدمات ونموذج الطلب.",
    publicPath: (d) => `/services#${d.slug}`,
    title: (d) => d.title,
    subtitle: (d) => d.description,
    empty: () => ({ slug: "", title: "", icon: "consultation", description: "", details: "", whenNeeded: [] }),
  },
  areas: {
    label: "مجالات الممارسة",
    singular: "مجال",
    description: "مجالات الأفراد والشركات؛ لكل مجال صفحة خاصة.",
    publicPath: (d) => `/practice-areas/${d.slug}`,
    title: (d) => d.title,
    subtitle: (d) => `${tracks[d.track].title} — ${d.description}`,
    empty: () => ({
      slug: "",
      track: "individuals",
      title: "",
      icon: "family",
      description: "",
      intro: "",
      helpWith: [],
    }),
  },
  team: {
    label: "الفريق",
    singular: "عضو",
    description: "المحامون والمستشارون في صفحة الفريق.",
    publicPath: () => "/team",
    title: (d) => d.name,
    subtitle: (d) => d.role,
    empty: () => ({ id: "", name: "", role: "", initials: "", bio: "", focus: [], featured: false }),
  },
  guides: {
    label: "الأدلة القانونية",
    singular: "دليل",
    description: "مقالات توعوية؛ لكل دليل صفحة خاصة.",
    publicPath: (d) => `/guides/${d.slug}`,
    title: (d) => d.title,
    subtitle: (d) => `${d.category} — ${d.publishedAt}`,
    empty: () => ({
      slug: "",
      title: "",
      excerpt: "",
      category: "",
      publishedAt: new Date().toISOString().slice(0, 10),
      relatedArea: "",
      sections: [{ id: "intro", heading: "", blocks: [{ type: "p", text: "", items: [] }] }],
    }),
  },
  faq: {
    label: "الأسئلة الشائعة",
    singular: "مجموعة أسئلة",
    description: "مجموعات الأسئلة في صفحة الأسئلة الشائعة؛ المعلَّم منها يظهر في الرئيسية.",
    publicPath: (d) => `/faq#${d.id}`,
    title: (d) => d.title,
    subtitle: (d) => `${d.items.length} أسئلة`,
    empty: () => ({ id: "", title: "", items: [{ q: "", a: "", home: false }] }),
  },
};

export const collectionKeys = Object.keys(collectionMeta) as CollectionKey[];

export function isCollection(v: string): v is CollectionKey {
  return v in collectionMeta;
}
