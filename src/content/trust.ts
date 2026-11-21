/**
 * "Certified & Partnering With" — preserved from the live site, but grouped
 * so we do not imply a partnership or accreditation that does not exist.
 *
 * IMPORTANT: the `kind` for each item must be confirmed by Reckonwell before
 * launch (see docs/website-audit.md §6). Until then the UI uses neutral
 * wording ("Certified & partnering with") as the live site does.
 */
export type TrustKind = "regulatory" | "membership" | "software" | "banking";

export type TrustItem = {
  name: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  kind: TrustKind;
  /** Short factual note shown on hover / to screen readers. */
  note: string;
  /** Portrait badges are rendered taller so they read at the same weight. */
  tall?: boolean;
  confirmed: boolean;
};

export const trustItems: TrustItem[] = [
  {
    name: "HMRC AML Supervision",
    src: "/trust/hmrc-aml-supervised.png",
    alt: "HMRC anti-money laundering supervised",
    width: 263,
    height: 145,
    kind: "regulatory",
    note: "Supervised by HMRC for anti-money laundering",
    confirmed: false,
  },
  {
    name: "ICO",
    src: "/trust/ico.png",
    alt: "Registered with the Information Commissioner's Office",
    width: 191,
    height: 121,
    kind: "regulatory",
    note: "ICO registered — data protection reg. CSN3799691",
    confirmed: true,
  },
  {
    name: "IAB",
    src: "/trust/iab.png",
    alt: "International Association of Bookkeepers",
    width: 792,
    height: 248,
    kind: "membership",
    note: "International Association of Bookkeepers",
    confirmed: false,
  },
  {
    name: "Xero",
    src: "/trust/xero.png",
    alt: "Xero",
    width: 1210,
    height: 589,
    kind: "software",
    note: "Xero certified advisor (badge on the live site)",
    confirmed: false,
  },
  {
    name: "QuickBooks",
    src: "/trust/quickbooks.png",
    alt: "QuickBooks",
    width: 602,
    height: 800,
    kind: "software",
    note: "QuickBooks Certified ProAdvisor — Advanced Online (badge on the live site)",
    tall: true,
    confirmed: false,
  },
  {
    name: "Revolut Business",
    src: "/trust/revolut-business.png",
    alt: "Revolut Business",
    width: 800,
    height: 346,
    kind: "banking",
    note: "Revolut Business",
    confirmed: false,
  },
  {
    name: "Tide",
    src: "/trust/tide.png",
    alt: "Tide",
    width: 800,
    height: 330,
    kind: "banking",
    note: "Tide",
    confirmed: false,
  },
];

export const trustGroupLabels: Record<TrustKind, string> = {
  regulatory: "Regulated & registered",
  membership: "Professional membership",
  software: "Accounting software",
  banking: "Business banking",
};
