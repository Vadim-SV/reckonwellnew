import { cn } from "@/lib/utils";

export function Eyebrow({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-[11px] font-medium uppercase tracking-[0.18em] text-muted", className)}
      {...props}
    />
  );
}
