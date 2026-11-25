import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function LinkCard({
  href,
  title,
  text,
  meta,
  className,
}: {
  href: string;
  title: string;
  text: string;
  meta?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex h-full flex-col rounded-card border border-hairline bg-white/70 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-navy/40 hover:bg-white hover:shadow-card",
        className,
      )}
    >
      {meta && <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted">{meta}</span>}
      <span className="mt-2 flex items-start justify-between gap-4">
        <span className="font-display text-2xl text-ink">{title}</span>
        <ArrowUpRight className="mt-1 size-5 shrink-0 text-navy transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
      </span>
      <span className="mt-3 text-[15px] leading-relaxed text-body">{text}</span>
    </Link>
  );
}
