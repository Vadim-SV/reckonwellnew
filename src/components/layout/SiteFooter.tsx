import Image from "next/image";
import Link from "next/link";
import { footerNav } from "@/lib/navigation";
import { site } from "@/lib/site";

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h2 className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-[#b8b8b8]">
        {title}
      </h2>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-sm text-white/80 transition-colors hover:text-rose">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-ink text-[#b8b8b8]">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-2">
          <Image
            src="/brand/reckonwell-logo-white.png"
            alt="Reckonwell"
            width={2000}
            height={270}
            className="h-7 w-auto"
          />
          <p className="mt-6 max-w-xs text-sm leading-relaxed">
            We look after the financial side of growing businesses. London-based, working with
            companies across the UK.
          </p>
          <address className="mt-6 text-sm not-italic leading-relaxed">
            {site.address.street}, {site.address.locality} {site.address.postcode}
            <br />
            <a href={site.phoneHref} className="hover:text-rose">
              {site.phone}
            </a>
            {" · "}
            <a href={`mailto:${site.email}`} className="hover:text-rose">
              {site.email}
            </a>
          </address>
        </div>
        <FooterColumn title="Services" links={footerNav.services} />
        <FooterColumn title="Industries" links={footerNav.industries} />
        <FooterColumn title="Get started" links={footerNav.company} />
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>
            © {new Date().getFullYear()} {site.legalName}. ICO registered · Data protection reg.{" "}
            {site.icoRegistration}
          </p>
          <ul className="flex gap-6">
            {footerNav.legal.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="uppercase tracking-widest hover:text-rose">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
