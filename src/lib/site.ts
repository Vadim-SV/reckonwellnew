/**
 * Single source of truth for company details used across the site,
 * metadata, structured data and (later) emails.
 * Values marked "verified" were taken from the live site (reckonwell.com).
 */
export const site = {
  name: "Reckonwell",
  legalName: "Reckonwell Ltd", // from the original privacy policy; TODO: add company number
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.reckonwell.com",
  tagline: "We look after the financial side of growing businesses.",
  description:
    "London-based outsourced bookkeeping, accounting and financial operations for growing UK businesses — from bank reconciliations and credit control to monthly management accounts.",
  email: "vadim.s@reckonwell.com",
  phone: "020 3818 6205", // verified (displayed as 02038186205 on the live site)
  phoneHref: "tel:+442038186205",
  address: {
    street: "124 City Road", // verified
    locality: "London",
    postcode: "EC1V 2NX",
    country: "GB",
  },
  icoRegistration: "CSN3799691", // verified
  founder: "Vadim Siubaeff", // verified
  locale: "en_GB",
} as const;
