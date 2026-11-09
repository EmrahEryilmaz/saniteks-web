"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";
import { focusStyle } from "@/components/ui/styles";

/** Keep Tab focus inside the open dialog. */
function trapTab(e: KeyboardEvent<HTMLDialogElement>) {
  if (e.key !== "Tab") return;
  const focusables = e.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex="0"]');
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last?.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first?.focus();
  }
}

/** Full-height side dialog used below the lg breakpoint. `logo` and `footer` are server-rendered slots. */
export function MobileMenu({ logo, children, footer }: { logo: ReactNode; children: ReactNode; footer: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const close = () => dialogRef.current?.close();

  // Close after navigation.
  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  // Close when the viewport grows to the desktop layout.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1280px)");
    const onChange = () => {
      if (mq.matches) dialogRef.current?.close();
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Lock page scroll while open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const onDialogClick = (e: MouseEvent<HTMLDialogElement>) => {
    // Backdrop click, or a link to the page we are already on.
    if (e.target === e.currentTarget || (e.target as HTMLElement).closest("a[href]")) close();
  };

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        aria-label="Menüyü aç"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => {
          dialogRef.current?.showModal();
          setOpen(true);
        }}
        className={`flex size-12 items-center justify-center border border-current/40 text-inherit transition-colors hover:bg-primary hover:text-primary-foreground active:bg-primary-active motion-reduce:transition-none ${focusStyle}`}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <dialog
        ref={dialogRef}
        id="mobile-menu"
        aria-labelledby="mobile-menu-title"
        onClose={() => {
          setOpen(false);
          if (toggleRef.current?.getClientRects().length) toggleRef.current.focus();
        }}
        onClick={onDialogClick}
        onKeyDown={trapTab}
        className="fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-dvh w-full max-w-none border-0 border-l-4 border-l-primary bg-foreground p-0 text-primary-foreground backdrop:bg-overlay/60 md:w-[min(85vw,620px)]"
      >
        <div className="min-h-full p-6 md:p-10">
          <div className="mb-8 flex items-center justify-between gap-4">
            <h2 id="mobile-menu-title" className="sr-only">
              Site menüsü
            </h2>
            {logo}
            <button
              type="button"
              aria-label="Menüyü kapat"
              onClick={close}
              className={`flex size-12 items-center justify-center border border-primary-foreground/30 text-2xl hover:bg-primary active:bg-primary-active ${focusStyle}`}
            >
              ×
            </button>
          </div>
          <nav aria-label="Ana navigasyon">{children}</nav>
          {footer}
        </div>
      </dialog>
    </>
  );
}
