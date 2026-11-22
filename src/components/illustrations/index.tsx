"use client";

import type { IllustrationKey } from "@/content/services";
import { AccountsPayableFlow } from "./AccountsPayableFlow";
import { BankToLedger } from "./BankToLedger";
import { CreditControlBoard } from "./CreditControlBoard";
import { FilingTracker } from "./FilingTracker";
import { GroupStructure } from "./GroupStructure";
import { ManagementReport } from "./ManagementReport";
import { MonthEndClose } from "./MonthEndClose";
import { PayrollRun } from "./PayrollRun";
import { ScrollDepth } from "./ScrollDepth";
import { SystemsSync } from "./SystemsSync";
import { TeamCapacity } from "./TeamCapacity";
import { VatReturn } from "./VatReturn";

const map: Record<IllustrationKey, () => React.ReactElement> = {
  bookkeeping: () => <BankToLedger />,
  "finance-team": () => <TeamCapacity />,
  payroll: () => <PayrollRun />,
  vat: () => <VatReturn />,
  "annual-accounts": () => (
    <FilingTracker
      title="Year-end · Calder & Finch Ltd"
      doneLabel="Filed early"
      items={[
        { label: "Year-end records collected", meta: "Week 1" },
        { label: "Accounts prepared (FRS 102)", meta: "Week 3" },
        { label: "Tax computation and CT600", meta: "Week 4" },
        { label: "Approved by the directors", meta: "Week 5" },
        { label: "Filed at Companies House and HMRC", meta: "Months before the deadline" },
      ]}
    />
  ),
  "self-assessment": () => (
    <FilingTracker
      title="Self Assessment · 2025–26"
      doneLabel="Filed in autumn"
      items={[
        { label: "Income and dividends gathered", meta: "May–June" },
        { label: "Running tax estimate shared", meta: "Through the year" },
        { label: "Return prepared and checked", meta: "September" },
        { label: "Return filed with HMRC", meta: "Well before 31 January" },
      ]}
    />
  ),
  mtd: () => (
    <FilingTracker
      title="Making Tax Digital · 2026–27"
      doneLabel="Year finalised"
      items={[
        { label: "Quarter 1 update sent", meta: "Apr–Jun" },
        { label: "Quarter 2 update sent", meta: "Jul–Sep" },
        { label: "Quarter 3 update sent", meta: "Oct–Dec" },
        { label: "Quarter 4 update sent", meta: "Jan–Mar" },
        { label: "Final declaration submitted", meta: "After the tax year" },
      ]}
    />
  ),
  rd: () => (
    <FilingTracker
      title="R&D claim · FY 2025"
      doneLabel="Claim filed"
      items={[
        { label: "Eligibility review", meta: "Does the work qualify?" },
        { label: "Qualifying spend identified", meta: "Staff, software, subcontractors" },
        { label: "Technical narrative written", meta: "Advances and uncertainties" },
        { label: "Claim filed with the CT600", meta: "Questions answered on your behalf" },
      ]}
    />
  ),
  "accounts-payable": () => <AccountsPayableFlow />,
  "credit-control": () => <CreditControlBoard />,
  "management-accounts": () => <ManagementReport />,
  "month-end-close": () => <MonthEndClose />,
  "accounting-systems": () => <SystemsSync />,
  "group-companies": () => <GroupStructure />,
};

/** Service illustration. In the hero it gets gentle scroll depth; scroll-driven ones manage their own motion. */
export function ServiceIllustration({ name, depth = false }: { name: IllustrationKey; depth?: boolean }) {
  const node = map[name]();
  return depth ? <ScrollDepth>{node}</ScrollDepth> : node;
}
