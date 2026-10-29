/** مفتاح localStorage لتفضيل المظهر */
export const THEME_KEY = "alomari:theme";

export type Theme = "light" | "dark";

export const themeColors: Record<Theme, string> = { light: "#f8f6f1", dark: "#121a19" };

/** يضبط المظهر قبل أول رسم لتجنب وميض الألوان: التفضيل المحفوظ، وإلا مظهر النظام */
export const themeScript = `try{var t=localStorage.getItem("${THEME_KEY}");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="light"}`;
