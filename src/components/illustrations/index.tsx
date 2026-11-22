"use client";

import type { IllustrationKey } from "@/content/services";
import { AccountsPayableFlow } from "./AccountsPayableFlow";
import { CreditControlBoard } from "./CreditControlBoard";
import { GroupStructure } from "./GroupStructure";
import { ManagementReport } from "./ManagementReport";
import { MonthEndClose } from "./MonthEndClose";
import { SystemsSync } from "./SystemsSync";

const map: Record<IllustrationKey, React.ComponentType> = {
  "accounts-payable": AccountsPayableFlow,
  "credit-control": CreditControlBoard,
  "management-accounts": ManagementReport,
  "month-end-close": MonthEndClose,
  "accounting-systems": SystemsSync,
  "group-companies": GroupStructure,
};

export function ServiceIllustration({ name }: { name: IllustrationKey }) {
  const Component = map[name];
  return <Component />;
}
