"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { ctaNav, primaryNav } from "@/lib/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

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

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300",
        scrolled || open
          ? "bg-cream/90 shadow-[0_1px_0_var(--border)] backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[60] focus:bg-navy focus:px-4 focus:py-2 focus:text-cream"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:h-20 lg:px-8">
        <Link href="/" aria-label="Reckonwell home" className="shrink-0">
          <Image
            src="/brand/reckonwell-logo-black.png"
            alt="Reckonwell"
            width={2000}
            height={270}
            priority
            className="h-6 w-auto lg:h-7"
          />
        </Link>

        <nav aria-label="Main" className="hidden xl:block">
          <ul className="flex items-center gap-5 2xl:gap-7">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "whitespace-nowrap text-[13px] tracking-wide text-body transition-colors hover:text-navy",
                    pathname?.startsWith(item.href) && "text-navy underline underline-offset-8",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <ButtonLink href={ctaNav.quote.href} variant="secondary" size="sm">
            {ctaNav.quote.label}
          </ButtonLink>
          <ButtonLink href={ctaNav.book.href} size="sm">
            {ctaNav.book.label}
          </ButtonLink>
        </div>

        <button
          type="button"
          className="inline-flex size-11 items-center justify-center text-navy xl:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X aria-hidden /> : <Menu aria-hidden />}
        </button>
      </div>

      {open && (
        <div id="mobile-menu" className="h-[calc(100dvh-4rem)] overflow-y-auto bg-cream xl:hidden">
          <nav aria-label="Mobile" className="px-4 pb-10 pt-4 sm:px-6">
            <ul className="divide-y divide-[var(--border)] border-y border-hairline">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="block py-4 font-display text-2xl text-ink">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={ctaNav.partner.href} className="block py-4 font-display text-2xl text-ink">
                  {ctaNav.partner.label}
                </Link>
              </li>
            </ul>
            <div className="mt-8 grid gap-3">
              <ButtonLink href={ctaNav.book.href} size="lg">
                {ctaNav.book.label}
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
