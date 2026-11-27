"use client";

import { Link } from "@/i18n/Link";
import { stripLocale } from "@/i18n/config";
import { useT } from "@/i18n/client";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type FocusEvent, type KeyboardEvent } from "react";
import type { NavEntry } from "@/lib/navigation";
import { focusStyle } from "@/components/ui/styles";

type Variant = "desktop" | "mobile" | "footer";

/** aria-current for a nav href: "page" on the exact route, "location" on an ancestor or matching hash. */
function useCurrent() {
  const pathname = stripLocale(usePathname()).path;
  const [hash, setHash] = useState("");

  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    sync();
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("popstate", sync);
    };
  }, [pathname]);

  return (href: string, activePrefix?: string): "page" | "location" | undefined => {
    if (href.includes("#")) return `${pathname}${hash}` === href ? "location" : undefined;
    if (pathname === href) return href === "/" && hash ? undefined : "page";
    if (href !== "/" && pathname.startsWith(`${href}/`)) return "location";
    if (activePrefix && (pathname === activePrefix || pathname.startsWith(`${activePrefix}/`))) return "location";
    return undefined;
  };
}

const linkClass: Record<Variant, string> = {
  desktop: "py-3 text-sm font-semibold",
  mobile: "min-w-0 flex-1 py-5 text-2xl font-medium text-primary-foreground md:text-3xl",
  footer: "w-fit py-2 text-sm text-primary-foreground/85 hover:text-primary-foreground",
};

const submenuClass: Record<Variant, string> = {
  desktop: "absolute top-full start-0 z-50 min-w-64 border-t-2 border-primary bg-surface p-2 text-foreground shadow-sm",
  mobile: "mb-3 ms-10 border-s border-primary-foreground/25 ps-5",
  footer: "ms-4 border-s border-primary-foreground/20 ps-4",
};

const submenuLinkClass: Record<Variant, string> = {
  desktop: "px-4 py-3 text-sm font-semibold text-foreground hover:bg-surface-muted hover:text-link active:bg-surface-strong",
  mobile: "py-3 text-lg font-medium text-primary-foreground",
  footer: "w-fit py-2 text-sm text-primary-foreground/85 hover:text-primary-foreground",
};

export function NavigationLinks({ items, variant }: { items: NavEntry[]; variant: Variant }) {
  const current = useCurrent();
  const pathname = usePathname();
  const t = useT();
  // The open submenu is remembered together with the path it was opened on, so navigating closes it.
  const [menu, setMenu] = useState<{ id: string | null; path: string }>({ id: null, path: pathname });
  const openId = menu.path === pathname ? menu.id : null;
  const setOpenId = (next: string | null | ((current: string | null) => string | null)) =>
    setMenu((m) => {
      const current = m.path === pathname ? m.id : null;
      return { id: typeof next === "function" ? next(current) : next, path: pathname };
    });
  const toggleRef = useRef<HTMLButtonElement>(null);
  const interactive = variant !== "footer";

  // Desktop: close on outside pointer down.
  useEffect(() => {
    if (variant !== "desktop" || !openId) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!document.getElementById(`desktop-${openId}-submenu`)?.parentElement?.contains(target)) setMenu((m) => ({ ...m, id: null }));
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [openId, variant]);

  const onBlurCapture = (e: FocusEvent<HTMLLIElement>, id: string) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpenId((open) => (open === id ? null : open));
  };

  const onKeyDown = (e: KeyboardEvent<HTMLLIElement>, id: string) => {
    if (e.key === "Escape" && openId === id) {
      e.preventDefault();
      e.stopPropagation();
      setOpenId(null);
      toggleRef.current?.focus();
    }
  };

  return (
    <ul className={variant === "desktop" ? "flex items-center gap-5 2xl:gap-7" : "flex flex-col"}>
      {items.map((item, index) => {
        const children = item.children;
        const open = openId === item.id;
        const submenuId = `${variant}-${item.id}-submenu`;
        const showSubmenu = children && (variant === "footer" || open);
        const hoverable = variant === "desktop" && children;
        return (
          <li
            key={item.id}
            onMouseEnter={hoverable ? () => setOpenId(item.id) : undefined}
            onMouseLeave={hoverable ? () => setOpenId(null) : undefined}
            onBlurCapture={interactive && children ? (e) => onBlurCapture(e, item.id) : undefined}
            onKeyDown={interactive && children ? (e) => onKeyDown(e, item.id) : undefined}
            className={`${variant === "mobile" ? "border-b border-primary-foreground/20" : ""} ${variant === "desktop" && children ? "relative" : ""}`}
          >
            <div className={children && interactive ? "flex items-center" : undefined}>
              <Link
                href={item.href}
                aria-current={current(item.href, item.activePrefix)}
                onClick={() => setOpenId(null)}
                className={`group/nav relative flex min-h-11 items-center gap-5 ${focusStyle} ${linkClass[variant]}`}
              >
                {variant === "mobile" ? (
                  <span aria-hidden="true" className="text-xs font-normal tabular-nums text-primary-foreground/60">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                ) : null}
                <span className="transition-transform duration-200 group-hover/nav:translate-x-0.5 rtl:group-hover/nav:-translate-x-0.5 motion-reduce:transform-none motion-reduce:transition-none">
                  {item.label}
                </span>
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-1 h-0.5 origin-left rtl:origin-right scale-x-0 bg-primary transition-transform duration-200 group-hover/nav:scale-x-100 group-aria-[current=page]/nav:scale-x-100 group-aria-[current=location]/nav:scale-x-100 motion-reduce:transition-none"
                />
              </Link>
              {children && interactive ? (
                <button
                  ref={variant === "desktop" ? toggleRef : undefined}
                  type="button"
                  aria-label={open ? t("{label} alt menüsünü kapat", { label: item.label }) : t("{label} alt menüsünü aç", { label: item.label })}
                  aria-expanded={open}
                  aria-controls={submenuId}
                  onClick={() => setOpenId(open ? null : item.id)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setOpenId(item.id);
                      requestAnimationFrame(() => document.querySelector<HTMLAnchorElement>(`#${submenuId} a`)?.focus());
                    }
                  }}
                  className={`flex size-11 shrink-0 items-center justify-center text-current ${focusStyle}`}
                >
                  <span
                    aria-hidden="true"
                    className={`text-base transition-transform duration-200 ${open ? "rotate-180" : ""} motion-reduce:transition-none`}
                  >
                    ⌄
                  </span>
                </button>
              ) : null}
            </div>
            {showSubmenu ? (
              <ul id={variant === "footer" ? undefined : submenuId} className={submenuClass[variant]}>
                {children.map((child) => (
                  <li key={child.id}>
                    <Link
                      href={child.href}
                      aria-current={current(child.href)}
                      onClick={() => setOpenId(null)}
                      className={`flex min-h-11 items-center ${focusStyle} ${submenuLinkClass[variant]}`}
                    >
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
