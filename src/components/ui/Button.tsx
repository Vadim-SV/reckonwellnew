import Link from "next/link";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-navy text-cream hover:bg-navy-deep",
  secondary: "border border-hairline bg-transparent text-navy hover:border-navy hover:bg-white/50",
  light: "bg-cream text-navy hover:bg-white",
  ghost: "text-navy underline-offset-4 hover:underline",
} as const;

const sizes = {
  sm: "min-h-10 px-4 text-xs",
  md: "min-h-12 px-6 py-2.5 text-sm",
  lg: "min-h-14 px-6 py-3 text-sm sm:px-8",
} as const;

type Common = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
  children: React.ReactNode;
};

const base =
  "inline-flex items-center justify-center gap-2 text-center leading-snug whitespace-normal sm:whitespace-nowrap rounded-xs font-medium tracking-wide transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50";

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: Common & { href: string } & Omit<React.ComponentProps<typeof Link>, "href" | "className">) {
  return (
    <Link href={href} className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </Link>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: Common & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </button>
  );
}
