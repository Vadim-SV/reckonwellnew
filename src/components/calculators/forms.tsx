"use client";

import type { CalculatorInputs, CalculatorKey } from "@/lib/pricing/registry";
import { QUOTE_INDUSTRIES } from "@/lib/pricing/instant-quote";
import { Choice, Field, NumberField, RangeField, Toggle, YesNo, compactGBP } from "./controls";

type FormProps<K extends CalculatorKey> = {
  value: CalculatorInputs<K>;
  set: (patch: Partial<CalculatorInputs<K>>) => void;
};

const volume = (low: string, medium: string, high: string) => [
  { value: "low" as const, label: "Low", sub: low },
  { value: "medium" as const, label: "Medium", sub: medium },
  { value: "high" as const, label: "High", sub: high },
];

function Bookkeeping({ value: v, set }: FormProps<"bookkeeping">) {
  return (
    <div className="space-y-8">
      <RangeField
        label="Transactions per month"
        hint="Roughly the number of lines on your bank and card statements each month."
        min={0}
        max={2000}
        step={10}
        value={v.transactionsPerMonth}
        onChange={(n) => set({ transactionsPerMonth: n })}
        format={(n) => n.toLocaleString("en-GB")}
      />
      <Field label="Optional extras">
        <Toggle label="Bring backlogged books up to date" checked={v.cleanupRequired} onChange={(b) => set({ cleanupRequired: b })} />
        <Toggle
          label="Accounting software setup & training"
          hint="Xero or QuickBooks set up with bank feeds and rules."
          checked={v.softwareSetupRequired}
          onChange={(b) => set({ softwareSetupRequired: b })}
        />
      </Field>
      {v.cleanupRequired && (
        <NumberField label="How many months are behind?" min={1} max={120} value={v.cleanupMonths} onChange={(n) => set({ cleanupMonths: n })} />
      )}
    </div>
  );
}

function Payroll({ value: v, set }: FormProps<"payroll">) {
  return (
    <NumberField
      label="Number of employees on payroll"
      hint="Include directors who are paid through payroll."
      min={1}
      max={10_000}
      value={v.employees}
      onChange={(n) => set({ employees: n })}
    />
  );
}

function AnnualAccounts({ value: v, set }: FormProps<"annual-accounts">) {
  return (
    <div className="space-y-8">
      <RangeField
        label="Annual profit before tax"
        hint="Use your last filed accounts or a current estimate."
        min={0}
        max={5_000_000}
        step={10_000}
        value={v.annualProfit}
        onChange={(n) => set({ annualProfit: n })}
        format={(n) => (n >= 5_000_000 ? "£5m+" : compactGBP(n))}
      />
      <Choice
        label="Employees"
        columns={4}
        value={v.employees}
        onChange={(e) => set({ employees: e })}
        options={[
          { value: "0", label: "None", sub: "Directors only" },
          { value: "1-5", label: "1–5" },
          { value: "6-20", label: "6–20" },
          { value: "20+", label: "20+" },
        ]}
      />
      <Choice
        label="How closely should we monitor your position?"
        columns={3}
        value={v.monitoring}
        onChange={(m) => set({ monitoring: m })}
        options={[
          { value: "annual", label: "Annual", sub: "Year-end accounts and CT600" },
          { value: "quarterly", label: "Quarterly", sub: "Quarterly reviews plus year-end" },
          { value: "monthly", label: "Monthly", sub: "Monthly pack plus year-end" },
        ]}
      />
      <Choice
        label="Monthly transaction volume"
        columns={3}
        value={v.transactions}
        onChange={(t) => set({ transactions: t })}
        options={volume("Under 100 a month", "100–500 a month", "Over 500 a month")}
      />
      <Field label="Also needed">
        <Toggle label="Monthly management accounts" checked={v.managementAccounts} onChange={(b) => set({ managementAccounts: b })} />
        <Toggle label="We invest in R&D" hint="Ongoing R&D relief support." checked={v.hasRdSpend} onChange={(b) => set({ hasRdSpend: b })} />
        <Toggle label="We have or are seeking investors" hint="Investor reporting." checked={v.raisingInvestment} onChange={(b) => set({ raisingInvestment: b })} />
      </Field>
    </div>
  );
}

function Vat({ value: v, set }: FormProps<"vat">) {
  return (
    <div className="space-y-8">
      <Choice
        label="How often do you file VAT returns?"
        columns={3}
        value={String(v.returnsPerYear) as "4" | "12" | "1"}
        onChange={(r) => set({ returnsPerYear: Number(r) })}
        options={[
          { value: "4", label: "Quarterly", sub: "4 returns a year" },
          { value: "12", label: "Monthly", sub: "12 returns a year" },
          { value: "1", label: "Annually", sub: "Annual accounting scheme" },
        ]}
      />
      <YesNo label="Do you need help registering for VAT?" value={v.registration} onChange={(b) => set({ registration: b })} />
    </div>
  );
}

function SelfAssessment({ value: v, set }: FormProps<"self-assessment">) {
  return (
    <div className="space-y-8">
      <RangeField
        label="Annual income"
        min={0}
        max={300_000}
        step={5_000}
        value={v.income}
        onChange={(n) => set({ income: n })}
        format={(n) => (n >= 300_000 ? "£300k+" : compactGBP(n))}
      />
      <YesNo label="Do you have rental income?" value={v.hasRental} onChange={(b) => set({ hasRental: b })} />
      <Choice
        label="Level of support"
        value={v.monitoring}
        onChange={(m) => set({ monitoring: m })}
        options={[
          { value: "annual", label: "Annual filing", sub: "We file your return once a year" },
          { value: "monthly", label: "Monthly monitoring", sub: "Monthly review and a running tax estimate" },
        ]}
      />
      <Choice
        label="Monthly transaction volume"
        columns={3}
        value={v.transactions}
        onChange={(t) => set({ transactions: t })}
        options={volume("Under 50 a month", "50–200 a month", "Over 200 a month")}
      />
    </div>
  );
}

function Mtd({ value: v, set }: FormProps<"mtd">) {
  return (
    <div className="space-y-8">
      <Choice
        label="Where does your income come from?"
        value={v.incomeType}
        onChange={(t) => set({ incomeType: t })}
        options={[
          { value: "self-employed", label: "Self-employed", sub: "Trading or freelance income" },
          { value: "landlord", label: "Landlord", sub: "Residential or commercial property" },
        ]}
      />
      {v.incomeType === "landlord" && (
        <Choice
          label="How many properties?"
          columns={4}
          value={v.properties}
          onChange={(p) => set({ properties: p })}
          options={[
            { value: "1", label: "1" },
            { value: "2", label: "2" },
            { value: "3-5", label: "3–5" },
            { value: "5+", label: "5+" },
          ]}
        />
      )}
      <Choice
        label="Level of support"
        columns={3}
        value={v.tier}
        onChange={(t) => set({ tier: t })}
        options={[
          { value: "filing-only", label: "Filing only", sub: "Quarterly submissions to HMRC" },
          { value: "monitoring", label: "+ Monthly monitoring", sub: "Plus a monthly review of your position" },
          { value: "full-accounting", label: "+ Full accounting", sub: "Plus year-end accounts and tax planning" },
        ]}
      />
    </div>
  );
}

function RdFee({ value: v, set }: FormProps<"rd-fee">) {
  return (
    <div className="space-y-8">
      <Choice
        label="How would you like to work?"
        value={v.ongoing ? "retainer" : "claim"}
        onChange={(m) => set({ ongoing: m === "retainer" })}
        options={[
          { value: "claim", label: "One-off claim", sub: "We prepare your annual claim" },
          { value: "retainer", label: "Monthly retainer", sub: "Ongoing monitoring and rolling claims" },
        ]}
      />
      {!v.ongoing && (
        <RangeField
          label="Annual R&D spend"
          min={0}
          max={1_000_000}
          step={10_000}
          value={v.rdSpend}
          onChange={(n) => set({ rdSpend: n })}
          format={(n) => (n >= 1_000_000 ? "£1m+" : compactGBP(n))}
        />
      )}
      <YesNo label="Do you have patents or IP revenue?" value={v.hasPatents} onChange={(b) => set({ hasPatents: b })} />
      {!v.ongoing && (
        <YesNo label="Is this your first R&D claim?" value={v.firstTime} onChange={(b) => set({ firstTime: b })} />
      )}
    </div>
  );
}

function FinanceTeam({ value: v, set }: FormProps<"finance-team">) {
  return (
    <div className="space-y-8">
      <Field label="What should we take on?">
        <Toggle label="Bookkeeping & reconciliations" checked={v.bookkeeping} onChange={(b) => set({ bookkeeping: b })} />
        <Toggle label="Payroll" checked={v.payroll} onChange={(b) => set({ payroll: b })} />
        <Toggle label="VAT returns" checked={v.vat} onChange={(b) => set({ vat: b })} />
        <Toggle
          label="Senior financial analysis"
          hint="Budgets, forecasts and management reporting."
          checked={v.seniorAnalysis}
          onChange={(b) => set({ seniorAnalysis: b })}
        />
        <Toggle label="Fundraising & investor support" checked={v.fundraising} onChange={(b) => set({ fundraising: b })} />
      </Field>
      {v.bookkeeping && (
        <RangeField
          label="Transactions per month"
          min={0}
          max={3000}
          step={10}
          value={v.transactions}
          onChange={(n) => set({ transactions: n })}
          format={(n) => n.toLocaleString("en-GB")}
        />
      )}
      {v.payroll && (
        <div className="space-y-4">
          <NumberField label="Employees on payroll" min={0} max={10_000} value={v.employees} onChange={(n) => set({ employees: n })} />
          <Toggle label="HR assistance" checked={v.hrAssistance} onChange={(b) => set({ hrAssistance: b })} />
        </div>
      )}
    </div>
  );
}

function InstantQuote({ value: v, set }: FormProps<"instant-quote">) {
  const ltd = v.businessType === "limited-company";
  return (
    <div className="space-y-8">
      <Choice
        label="Business type"
        value={v.businessType}
        onChange={(t) => set({ businessType: t })}
        options={[
          { value: "limited-company", label: "Limited company" },
          { value: "sole-trader", label: "Sole trader" },
        ]}
      />
      <div>
        <label htmlFor="iq-industry" className="text-[15px] font-medium text-ink">
          Industry
        </label>
        <select
          id="iq-industry"
          value={v.industry}
          onChange={(e) => set({ industry: e.target.value })}
          className="mt-3 h-11 w-full rounded-xs border border-hairline bg-white px-3 text-ink outline-none focus:border-navy"
        >
          <option value="">Select your industry…</option>
          {QUOTE_INDUSTRIES.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
      </div>
      {ltd && (
        <div className="space-y-4">
          <Toggle label="This is a group of companies" checked={v.isGroup} onChange={(b) => set({ isGroup: b })} />
          {v.isGroup && (
            <NumberField label="Companies in the group" min={1} max={100} value={v.groupCompanyCount} onChange={(n) => set({ groupCompanyCount: n })} />
          )}
        </div>
      )}

      <Field label="Monthly services">
        <Toggle label="Bookkeeping" hint="£2 per transaction" checked={v.bookkeepingRequired} onChange={(b) => set({ bookkeepingRequired: b })} />
        <Toggle label="Payroll" hint="£4 per employee, from £25 a month" checked={v.payrollRequired} onChange={(b) => set({ payrollRequired: b })} />
      </Field>
      {v.bookkeepingRequired && (
        <NumberField label="Transactions per month" max={100_000} step={10} value={v.transactionsPerMonth} onChange={(n) => set({ transactionsPerMonth: n })} />
      )}
      {v.payrollRequired && <NumberField label="Employees" max={10_000} value={v.employees} onChange={(n) => set({ employees: n })} />}

      <Field label="One-off services">
        <Toggle label="Bring backlogged books up to date" checked={v.cleanupRequired} onChange={(b) => set({ cleanupRequired: b })} />
        {!ltd && <Toggle label="Self Assessment" hint="£200" checked={v.selfAssessmentRequired} onChange={(b) => set({ selfAssessmentRequired: b })} />}
        {ltd && (
          <>
            <Toggle label="Final accounts & CT600" checked={v.finalAccountsRequired} onChange={(b) => set({ finalAccountsRequired: b })} />
            <Toggle label="Self Assessment for directors" hint="£200 per director" checked={v.directorSaRequired} onChange={(b) => set({ directorSaRequired: b })} />
            <Toggle label="R&D tax credits application" hint="£300 + 5% success fee" checked={v.rdRequired} onChange={(b) => set({ rdRequired: b })} />
            <Toggle label="Patent Box application" hint="£300" checked={v.patentBoxRequired} onChange={(b) => set({ patentBoxRequired: b })} />
          </>
        )}
        <Toggle label="VAT registration assistance" hint="£50" checked={v.vatRegRequired} onChange={(b) => set({ vatRegRequired: b })} />
        <Toggle label="Accounting software setup & training" hint="£100" checked={v.softwareSetupRequired} onChange={(b) => set({ softwareSetupRequired: b })} />
      </Field>
      {v.cleanupRequired && (
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField label="Months behind" max={120} value={v.cleanupMonths} onChange={(n) => set({ cleanupMonths: n })} />
          {!v.bookkeepingRequired && (
            <NumberField label="Transactions per month" max={100_000} step={10} value={v.cleanupTransactions} onChange={(n) => set({ cleanupTransactions: n })} />
          )}
        </div>
      )}
      {ltd && v.finalAccountsRequired && (
        <NumberField
          label="Average monthly revenue"
          max={1_000_000_000}
          step={1000}
          suffix="£"
          value={v.monthlyRevenue}
          onChange={(n) => set({ monthlyRevenue: n })}
        />
      )}
      {ltd && v.directorSaRequired && (
        <NumberField label="Number of directors" max={50} value={v.directorSaCount} onChange={(n) => set({ directorSaCount: n })} />
      )}
    </div>
  );
}

export const calculatorForms: { [K in CalculatorKey]: React.ComponentType<FormProps<K>> } = {
  bookkeeping: Bookkeeping,
  payroll: Payroll,
  "annual-accounts": AnnualAccounts,
  vat: Vat,
  "self-assessment": SelfAssessment,
  mtd: Mtd,
  "rd-fee": RdFee,
  "finance-team": FinanceTeam,
  "instant-quote": InstantQuote,
};

export const calculatorDefaults: { [K in CalculatorKey]: CalculatorInputs<K> } = {
  bookkeeping: { transactionsPerMonth: 150, cleanupRequired: false, cleanupMonths: 3, softwareSetupRequired: false },
  payroll: { employees: 10 },
  "annual-accounts": {
    annualProfit: 200_000,
    employees: "1-5",
    monitoring: "quarterly",
    transactions: "medium",
    hasRdSpend: false,
    raisingInvestment: false,
    managementAccounts: true,
  },
  vat: { returnsPerYear: 4, registration: false },
  "self-assessment": { income: 60_000, hasRental: false, monitoring: "annual", transactions: "low" },
  mtd: { incomeType: "self-employed", tier: "filing-only", properties: "1" },
  "rd-fee": { rdSpend: 150_000, hasPatents: false, firstTime: true, ongoing: false },
  "finance-team": {
    businessType: "limited-company",
    bookkeeping: true,
    transactions: 300,
    seniorAnalysis: false,
    fundraising: false,
    payroll: true,
    employees: 15,
    hrAssistance: false,
    vat: true,
    vatReturns: 4,
    selfAssessment: false,
    selfAssessmentPeople: 1,
    corpTax: false,
    monthlyRevenue: 50_000,
  },
  "instant-quote": {
    businessType: "limited-company",
    industry: "",
    isGroup: false,
    groupCompanyCount: 2,
    bookkeepingRequired: true,
    transactionsPerMonth: 150,
    payrollRequired: true,
    employees: 10,
    cleanupRequired: false,
    cleanupMonths: 0,
    cleanupTransactions: 0,
    selfAssessmentRequired: false,
    finalAccountsRequired: true,
    monthlyRevenue: 25_000,
    directorSaRequired: false,
    directorSaCount: 0,
    rdRequired: false,
    patentBoxRequired: false,
    vatRegRequired: false,
    softwareSetupRequired: false,
  },
};
