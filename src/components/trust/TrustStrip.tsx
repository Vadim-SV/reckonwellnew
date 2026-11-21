import Image from "next/image";
import { trustItems } from "@/content/trust";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/utils";

/**
 * "Certified & partnering with" logo row, preserved from the live site.
 * Wording stays neutral until each relationship type is confirmed
 * (see src/content/trust.ts).
 */
export function TrustStrip({ className }: { className?: string }) {
  return (
    <div className={cn("text-center", className)}>
      <Eyebrow>Certified &amp; partnering with</Eyebrow>
      <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-8 sm:gap-x-14">
        {trustItems.map((item) => (
          <li key={item.name} title={item.note}>
            <Image
              src={item.src}
              alt={item.alt}
              width={item.width}
              height={item.height}
              className={cn(
                "w-auto object-contain opacity-90 grayscale-[15%] transition hover:opacity-100 hover:grayscale-0",
                item.tall ? "h-16 sm:h-20" : "h-10 sm:h-12",
              )}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
