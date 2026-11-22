"use client";

import { CheckboxGroup, Choice, NumberField, Toggle } from "@/components/calculators/controls";
import { labels, options, type ScopingInputs, type ScopingKey } from "@/lib/scoping/registry";

type FormProps<K extends ScopingKey> = {
  value: ScopingInputs<K>;
  set: (patch: Partial<ScopingInputs<K>>) => void;
};

/** Build Choice/CheckboxGroup options from the shared registry labels. */
function opts<G extends keyof typeof options>(group: G): { value: (typeof options)[G][number]; label: string }[] {
  return (options[group] as readonly (typeof options)[G][number][]).map((v) => ({ value: v, label: labels[group]?.[v] ?? v }));
}

function AccountsPayable({ value: v, set }: FormProps<"accounts-payable">) {
  return (
    <div className="space-y-8">
      <Choice label="Supplier invoices a month" columns={4} value={v.invoicesPerMonth} onChange={(x) => set({ invoicesPerMonth: x })} options={opts("monthlyVolume")} />
      <Choice label="How do supplier invoices arrive?" columns={4} value={v.arrival} onChange={(x) => set({ arrival: x })} options={opts("invoiceArrival")} />
      <Choice label="How often would you like to pay suppliers?" columns={3} value={v.paymentRuns} onChange={(x) => set({ paymentRuns: x })} options={opts("paymentRuns")} />
      <Choice label="Who approves payments?" columns={3} value={v.approval} onChange={(x) => set({ approval: x })} options={opts("approval")} />
      <Toggle
        label="Reconcile supplier statements each month"
        hint="Check your records against what suppliers say you owe."
        checked={v.statementReconciliations}
        onChange={(b) => set({ statementReconciliations: b })}
      />
      <Choice label="Accounting software" columns={3} value={v.software} onChange={(x) => set({ software: x })} options={opts("software")} />
    </div>
  );
}

function CreditControl({ value: v, set }: FormProps<"credit-control">) {
  return (
    <div className="space-y-8">
      <Choice label="Customer invoices a month" columns={4} value={v.invoicesPerMonth} onChange={(x) => set({ invoicesPerMonth: x })} options={opts("monthlyVolume")} />
      <Choice label="Your usual payment terms" columns={3} value={v.terms} onChange={(x) => set({ terms: x })} options={opts("terms")} />
      <Choice label="How much is overdue right now?" columns={3} value={v.overdue} onChange={(x) => set({ overdue: x })} options={opts("overdue")} />
      <Choice label="Who chases payments today?" columns={3} value={v.chasing} onChange={(x) => set({ chasing: x })} options={opts("chasing")} />
      <Toggle label="Follow up by phone as well as email" checked={v.phoneFollowUp} onChange={(b) => set({ phoneFollowUp: b })} />
      <Choice label="Accounting software" columns={3} value={v.software} onChange={(x) => set({ software: x })} options={opts("software")} />
    </div>
  );
}

function ManagementAccounts({ value: v, set }: FormProps<"management-accounts">) {
  return (
    <div className="space-y-8">
      <Choice label="How often do you want reports?" value={v.frequency} onChange={(x) => set({ frequency: x })} options={opts("frequency")} />
      <CheckboxGroup label="Who will read them?" values={v.audience} onChange={(x) => set({ audience: x })} options={opts("audience")} />
      <CheckboxGroup
        label="What would you like included?"
        hint="Every pack includes a profit and loss account and a balance sheet."
        values={v.extras}
        onChange={(x) => set({ extras: x })}
        options={opts("reportExtras")}
      />
      <NumberField label="Number of companies" min={1} max={50} value={v.companies} onChange={(n) => set({ companies: n })} />
      <Choice label="Accounting software" columns={3} value={v.software} onChange={(x) => set({ software: x })} options={opts("software")} />
    </div>
  );
}

function MonthEndClose({ value: v, set }: FormProps<"month-end-close">) {
  return (
    <div className="space-y-8">
      <Choice label="How long does month-end take today?" value={v.closeToday} onChange={(x) => set({ closeToday: x })} options={opts("closeToday")} />
      <CheckboxGroup label="What should the close cover?" values={v.tasks} onChange={(x) => set({ tasks: x })} options={opts("closeTasks")} />
      <div className="grid gap-6 sm:grid-cols-2">
        <NumberField label="Bank and card accounts" min={1} max={200} value={v.bankAccounts} onChange={(n) => set({ bankAccounts: n })} />
        <NumberField label="Companies" min={1} max={50} value={v.companies} onChange={(n) => set({ companies: n })} />
      </div>
      <Choice label="Accounting software" columns={3} value={v.software} onChange={(x) => set({ software: x })} options={opts("software")} />
    </div>
  );
}

function AccountingSystems({ value: v, set }: FormProps<"accounting-systems">) {
  return (
    <div className="space-y-8">
      <Choice label="What do you use today?" columns={3} value={v.current} onChange={(x) => set({ current: x })} options={opts("software")} />
      <Choice label="What would you like to do?" columns={3} value={v.goal} onChange={(x) => set({ goal: x })} options={opts("systemsGoal")} />
      <CheckboxGroup label="Which apps should connect to your accounts?" values={v.integrations} onChange={(x) => set({ integrations: x })} options={opts("integrations")} />
      <NumberField label="People who will use the software" min={1} max={500} value={v.users} onChange={(n) => set({ users: n })} />
      <Toggle label="Training for your team" checked={v.training} onChange={(b) => set({ training: b })} />
    </div>
  );
}

function GroupCompanies({ value: v, set }: FormProps<"group-companies">) {
  return (
    <div className="space-y-8">
      <NumberField label="How many companies are in the group?" min={2} max={50} value={v.companies} onChange={(n) => set({ companies: n })} />
      <Choice
        label="Transactions a month, across all companies"
        columns={4}
        value={v.transactionsPerMonth}
        onChange={(x) => set({ transactionsPerMonth: x })}
        options={opts("monthlyVolume")}
      />
      <Choice label="Accounting software" columns={3} value={v.software} onChange={(x) => set({ software: x })} options={opts("groupSoftware")} />
      <Choice label="Transactions between the companies" columns={3} value={v.intercompany} onChange={(x) => set({ intercompany: x })} options={opts("intercompany")} />
      <Choice label="Reporting you need" columns={3} value={v.reporting} onChange={(x) => set({ reporting: x })} options={opts("groupReporting")} />
      <Choice label="Your finance team today" columns={4} value={v.team} onChange={(x) => set({ team: x })} options={opts("team")} />
    </div>
  );
}

function StartupLaunch({ value: v, set }: FormProps<"startup-launch">) {
  return (
    <div className="space-y-8">
      <Choice label="Where are you now?" columns={4} value={v.stage} onChange={(x) => set({ stage: x })} options={opts("startupStage")} />
      <Choice label="Business structure" columns={3} value={v.structure} onChange={(x) => set({ structure: x })} options={opts("structure")} />
      <CheckboxGroup label="What would you like help with?" values={v.needs} onChange={(x) => set({ needs: x })} options={opts("startupNeeds")} />
      <Choice
        label="Expected transactions a month"
        columns={4}
        value={v.transactionsPerMonth}
        onChange={(x) => set({ transactionsPerMonth: x })}
        options={opts("monthlyVolume")}
      />
    </div>
  );
}

export const scopingForms: { [K in ScopingKey]: React.ComponentType<FormProps<K>> } = {
  "accounts-payable": AccountsPayable,
  "credit-control": CreditControl,
  "management-accounts": ManagementAccounts,
  "month-end-close": MonthEndClose,
  "accounting-systems": AccountingSystems,
  "group-companies": GroupCompanies,
  "startup-launch": StartupLaunch,
};

export const scopingDefaults: { [K in ScopingKey]: ScopingInputs<K> } = {
  "accounts-payable": {
    invoicesPerMonth: "50-200",
    arrival: "email",
    paymentRuns: "weekly",
    approval: "owner",
    statementReconciliations: true,
    software: "xero",
  },
  "credit-control": {
    invoicesPerMonth: "50-200",
    terms: "30",
    overdue: "some",
    chasing: "ad-hoc",
    phoneFollowUp: true,
    software: "xero",
  },
  "management-accounts": { frequency: "monthly", audience: ["owners"], extras: ["commentary", "aged-balances"], companies: 1, software: "xero" },
  "month-end-close": { closeToday: "over-10", tasks: ["bank", "accruals", "payroll", "vat"], bankAccounts: 3, companies: 1, software: "xero" },
  "accounting-systems": { current: "spreadsheets", goal: "move", integrations: ["bank-feeds", "capture"], users: 3, training: true },
  "group-companies": {
    companies: 3,
    transactionsPerMonth: "200-500",
    software: "same",
    intercompany: "regular",
    reporting: "overview",
    team: "finance-manager",
  },
  "startup-launch": { stage: "just-incorporated", structure: "limited-company", needs: ["software", "bank", "invoicing", "deadlines"], transactionsPerMonth: "under-50" },
};
