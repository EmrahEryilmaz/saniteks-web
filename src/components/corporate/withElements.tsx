import { Fragment, type ReactNode } from "react";

/**
 * Fills {name} placeholders of an already translated sentence with React elements, so a sentence with inline markup
 * stays one translation unit: withElements(t("… {products} …"), { products: <strong>{t("…")}</strong> }).
 * Unknown placeholders are left as text.
 */
export function withElements(text: string, elements: Record<string, ReactNode>): ReactNode {
  return text.split(/(\{\w+\})/g).map((part, i) => {
    const key = /^\{(\w+)\}$/.exec(part)?.[1];
    return <Fragment key={i}>{key && key in elements ? elements[key] : part}</Fragment>;
  });
}
