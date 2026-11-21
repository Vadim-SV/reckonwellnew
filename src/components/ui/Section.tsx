import { cn } from "@/lib/utils";

const tones = {
  cream: "bg-cream text-body",
  sand: "bg-sand text-body",
  mist: "bg-mist text-body",
  navy: "bg-navy text-cream [&_h1]:text-cream [&_h2]:text-cream [&_h3]:text-cream",
  ink: "bg-ink text-[#b8b8b8] [&_h1]:text-white [&_h2]:text-white [&_h3]:text-white",
} as const;

type Props = React.HTMLAttributes<HTMLElement> & {
  tone?: keyof typeof tones;
  spacing?: "sm" | "md" | "lg";
};

export function Section({ className, tone = "cream", spacing = "md", ...props }: Props) {
  return (
    <section
      className={cn(
        tones[tone],
        spacing === "sm" && "py-12 sm:py-16",
        spacing === "md" && "py-16 sm:py-24",
        spacing === "lg" && "py-20 sm:py-32",
        className,
      )}
      {...props}
    />
  );
}
