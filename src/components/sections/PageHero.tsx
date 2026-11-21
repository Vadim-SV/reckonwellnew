import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/utils";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

type Props = {
  eyebrow: string;
  title: string;
  lede: string;
  crumbs?: Crumb[];
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  aside?: React.ReactNode;
  className?: string;
};

export function PageHero({ eyebrow, title, lede, crumbs, primary, secondary, aside, className }: Props) {
  return (
    <section className={cn("relative overflow-hidden pt-6 pb-16 sm:pt-10 sm:pb-24", className)}>
      <Container>
        {crumbs && <Breadcrumbs items={crumbs} />}
        <div className={cn("mt-10 grid items-center gap-12", aside && "lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]")}>
          <div>
            <div className="rise">
              <Eyebrow>{eyebrow}</Eyebrow>
            </div>
            <h1 className="rise mt-5 text-5xl leading-[1.05] sm:text-6xl" style={{ animationDelay: "60ms" }}>
              {title}
            </h1>
            <p className="rise mt-6 max-w-2xl text-lg leading-relaxed" style={{ animationDelay: "120ms" }}>
              {lede}
            </p>
            {(primary || secondary) && (
              <div className="rise mt-9 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "180ms" }}>
                {primary && (
                  <ButtonLink href={primary.href} size="lg">
                    {primary.label}
                  </ButtonLink>
                )}
                {secondary && (
                  <ButtonLink href={secondary.href} variant="secondary" size="lg">
                    {secondary.label}
                  </ButtonLink>
                )}
              </div>
            )}
          </div>
          {aside && (
            <div className="rise" style={{ animationDelay: "200ms" }}>
              {aside}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
