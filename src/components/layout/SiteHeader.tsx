"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { ctaNav, primaryNav, type NavItem } from "@/lib/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

function Dropdown({ item, active }: { item: NavItem; active: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const hoverOpenedAt = useRef(0);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <li
      ref={ref}
      className="relative"
      onMouseEnter={() => {
        window.clearTimeout(closeTimer.current);
        if (!open) hoverOpenedAt.current = Date.now();
        setOpen(true);
      }}
      onMouseLeave={() => {
        closeTimer.current = window.setTimeout(() => setOpen(false), 120);
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => {
          // A click straight after hovering open should keep the menu open, not close it.
          if (Date.now() - hoverOpenedAt.current < 600) return;
          setOpen((v) => !v);
        }}
        className={cn(
          "flex items-center gap-1 whitespace-nowrap py-2 text-[14px] tracking-wide text-body transition-colors hover:text-navy",
          active && "text-navy",
        )}
      >
        {item.label}
        <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} aria-hidden />
      </button>
      {open && item.groups && (
        <div className="absolute top-full left-1/2 z-50 w-[54rem] max-w-[calc(100vw-2rem)] -translate-x-1/2 pt-3">
          <div className="rounded-panel border border-hairline bg-cream p-5 shadow-float">
            <div className="grid grid-cols-3 gap-6">
              {item.groups.map((g) => (
                <div key={g.title}>
                  <p className="px-3 text-[11px] font-medium uppercase tracking-[0.16em] text-muted">{g.title}</p>
                  <ul className="mt-2 space-y-0.5">
                    {g.links.map((c) => (
                      <li key={c.href}>
                        <Link
                          href={c.href}
                          onClick={() => setOpen(false)}
                          className="block rounded-card px-3 py-2 text-[15px] text-ink transition-colors hover:bg-sand"
                        >
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <Link
              href={item.href}
              onClick={() => setOpen(false)}
              className="mt-3 block border-t border-hairline px-3 pt-3 pb-1 text-sm text-steel hover:underline"
            >
              View all {item.label.toLowerCase()} →
            </Link>
          </div>
        </div>
      )}
      {open && item.children && (
        <div className="absolute top-full left-1/2 z-50 w-[36rem] -translate-x-1/2 pt-3">
          <div className="rounded-panel border border-hairline bg-cream p-3 shadow-float">
            <ul className="grid grid-cols-2 gap-1">
              {item.children?.map((c) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-card px-4 py-3 transition-colors hover:bg-sand"
                  >
                    <span className="block text-[15px] font-medium text-ink">{c.label}</span>
                    {c.description && <span className="mt-0.5 block text-[13px] leading-snug text-muted">{c.description}</span>}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href={item.href}
              onClick={() => setOpen(false)}
              className="mt-2 block border-t border-hairline px-4 pt-3 pb-1 text-sm text-steel hover:underline"
            >
              View all {item.label.toLowerCase()} →
            </Link>
          </div>
        </div>
      )}
    </li>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname() ?? "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu after navigation
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (item: NavItem) =>
    pathname === item.href ||
    pathname.startsWith(`${item.href}/`) ||
    Boolean(item.children?.some((c) => pathname === c.href)) ||
    Boolean(item.groups?.some((g) => g.links.some((c) => pathname === c.href)));

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300",
        scrolled || open ? "bg-cream/90 shadow-[0_1px_0_var(--border)] backdrop-blur-md" : "bg-transparent",
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-4 focus:z-[60] focus:bg-navy focus:px-4 focus:py-2 focus:text-cream"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:h-20 lg:px-8">
        <Link href="/" aria-label="Reckonwell home" className="shrink-0">
          <Image src="/brand/reckonwell-logo-black.png" alt="Reckonwell" width={2000} height={270} priority className="h-6 w-auto lg:h-7" />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {primaryNav.map((item) =>
              item.children || item.groups ? (
                <Dropdown key={item.href} item={item} active={isActive(item)} />
              ) : (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item) ? "page" : undefined}
                    className={cn(
                      "whitespace-nowrap text-[14px] tracking-wide text-body transition-colors hover:text-navy",
                      isActive(item) && "text-navy underline underline-offset-8",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="hidden lg:block">
          <ButtonLink href={ctaNav.contact.href} size="sm">
            {ctaNav.contact.label}
          </ButtonLink>
        </div>

        <button
          type="button"
          className="inline-flex size-11 items-center justify-center text-navy lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X aria-hidden /> : <Menu aria-hidden />}
        </button>
      </div>

      {open && (
        <div id="mobile-menu" className="h-[calc(100dvh-4rem)] overflow-y-auto bg-cream lg:hidden">
          <nav aria-label="Mobile" className="px-4 pt-2 pb-10 sm:px-6">
            {primaryNav.map((item) => (
              <div key={item.href} className="border-b border-hairline py-4">
                <Link href={item.href} className="block font-display text-2xl text-ink">
                  {item.label}
                </Link>
                {item.groups?.map((g) => (
                  <div key={g.title} className="mt-4">
                    <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">{g.title}</p>
                    <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2">
                      {g.links.map((c) => (
                        <li key={c.href}>
                          <Link href={c.href} className="text-[15px] text-body">
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                {item.children && (
                  <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link href={c.href} className="text-[15px] text-body">
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            <div className="mt-8 grid gap-3">
              <ButtonLink href={ctaNav.contact.href} size="lg">
                {ctaNav.contact.label}
              </ButtonLink>
              <ButtonLink href={ctaNav.quote.href} variant="secondary" size="lg">
                {ctaNav.quote.label}
              </ButtonLink>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
