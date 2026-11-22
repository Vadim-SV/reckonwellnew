import type { Service } from "./services";

/**
 * Financial operations and business-support services added in Stage 04.
 * None of these has approved pricing, so each uses a requirements tool
 * (tool.kind = "scoping") that ends in a tailored quote — never a price.
 */
export const operationsServices: Service[] = [
  {
    slug: "accounts-payable",
    href: "/services/accounts-payable",
    name: "Accounts payable",
    category: "operations",
    summary: "Supplier bills checked, approved and paid on time.",
    eyebrow: "Outsourced accounts payable",
    title: "Suppliers paid on time. No invoice pile.",
    lede: "We look after your supplier invoices from the moment they arrive: checking them, coding them, reconciling supplier statements and preparing payment runs for you to approve.",
    metaTitle: "Outsourced Accounts Payable Services",
    metaDescription:
      "Outsourced accounts payable for growing UK businesses: supplier invoices captured and checked, statements reconciled and payment runs prepared for your approval.",
    tool: { kind: "scoping", key: "accounts-payable" },
    calculatorTitle: "Tell us how you pay suppliers",
    calculatorIntro:
      "Answer a few questions about your supplier invoices. We'll summarise what we'd take on, then send you a tailored quote.",
    explanation: [
      "As a business grows, supplier invoices arrive faster than anyone has time to deal with them. Bills sit in inboxes, statements don't match and payment day becomes a scramble.",
      "We take that work off your team. Every bill is captured, checked against what was ordered and coded correctly. Before each payment run, you get a clear list to approve — nothing is paid without your say-so.",
    ],
    includes: [
      { title: "One inbox for bills", text: "Suppliers send invoices to a single address, so nothing gets lost in personal inboxes." },
      { title: "Checking and coding", text: "Each bill checked for accuracy and duplicates, then coded to the right account and VAT rate." },
      { title: "Approval before payment", text: "Bills go to the right person for approval, following the limits you set." },
      { title: "Payment runs", text: "Weekly, fortnightly or monthly payment runs prepared and ready for you to release." },
      { title: "Supplier statements", text: "Statements reconciled to your records so balances are right and queries get resolved." },
      { title: "Supplier queries", text: "Missing invoices and credit notes chased, so your purchase ledger stays clean." },
    ],
    benefits: [
      { title: "Fewer late payments", text: "Suppliers are paid when they expect, which protects relationships and terms." },
      { title: "You stay in control", text: "You approve every payment run. We prepare it; you press the button." },
      { title: "Accurate costs", text: "Bills are recorded when they arrive, so your monthly figures include everything you owe." },
    ],
    goodFit: [
      "Supplier invoices are piling up or getting lost",
      "Payment runs take hours of someone's week",
      "Suppliers are chasing you for statements that don't match",
      "You'd rather not hire another accounts assistant",
    ],
    steps: [
      { title: "Map how bills flow today", text: "We look at how invoices arrive, who approves them and how you pay." },
      { title: "Set up a simple process", text: "A single invoice inbox, an approval route and a payment-run timetable that suits you." },
      { title: "Run it every week", text: "We process bills as they arrive and prepare each payment run for approval." },
      { title: "Keep the ledger clean", text: "Monthly statement reconciliations and a clear list of what you owe." },
    ],
    faqs: [
      {
        question: "Do you make payments from our bank account?",
        answer:
          "We prepare the payment run and you approve and release it from your bank. That way money only leaves your account with your authorisation.",
      },
      {
        question: "Can you work with our approval limits?",
        answer:
          "Yes. We'll set up an approval route that matches how your business works — for example, a manager approving routine bills and a director approving anything above an agreed amount.",
      },
      {
        question: "What happens with supplier queries?",
        answer:
          "We deal with day-to-day queries such as missing invoices, credit notes and statement differences, and raise anything that needs your decision.",
      },
    ],
    related: ["credit-control", "month-end-close", "bookkeeping-services", "outsourced-financial-operations"],
    illustration: "accounts-payable",
  },
  {
    slug: "credit-control",
    href: "/services/credit-control",
    name: "Credit control",
    category: "operations",
    summary: "Customer invoices followed up politely until they're paid.",
    eyebrow: "Credit control services",
    title: "Get paid for the work you've done.",
    lede: "We keep track of what customers owe, send polite and persistent reminders, match payments as they arrive and tell you early when an account needs attention.",
    metaTitle: "Outsourced Credit Control Services",
    metaDescription:
      "Credit control outsourcing for UK businesses: overdue invoices followed up, customer payments matched and accurate aged-debtor reports every month.",
    tool: { kind: "scoping", key: "credit-control" },
    calculatorTitle: "Tell us about your customer invoices",
    calculatorIntro:
      "A few questions about your invoicing and how payments are chased today. We'll summarise what we'd do and send a tailored quote.",
    explanation: [
      "Chasing payments is the job nobody wants. It gets put off, overdue balances grow and cash gets tight — even when the business is doing well.",
      "We follow up every overdue invoice on a steady schedule, in a friendly tone that protects your customer relationships. Payments are matched as they arrive, and each month you see exactly who owes what.",
    ],
    includes: [
      { title: "Weekly debtor review", text: "Every outstanding invoice reviewed so nothing slips through." },
      { title: "Reminders that sound like you", text: "Polite, consistent emails written in your company's tone, sent on an agreed schedule." },
      { title: "Phone follow-up", text: "Calls to customers who don't respond by email, if you'd like us to make them." },
      { title: "Payment matching", text: "Customer receipts matched to the right invoices, so balances are always accurate." },
      { title: "Disputes and queries", text: "Queries logged and passed to the right person so they get resolved quickly." },
      { title: "Monthly aged-debtor report", text: "A short summary of what's owed, what's overdue and any accounts to watch." },
    ],
    benefits: [
      { title: "Better cash flow", text: "Money comes in sooner when someone follows up consistently." },
      { title: "Clear customer balances", text: "You know who owes what, without digging through spreadsheets." },
      { title: "Relationships protected", text: "Reminders are polite and professional, and you decide how firm to be." },
    ],
    goodFit: [
      "Overdue invoices are building up",
      "Nobody has time to chase payments properly",
      "Customer balances in your accounts don't look right",
      "You want earlier warning when a customer stops paying",
    ],
    steps: [
      { title: "Review what's owed", text: "We go through your current debtor list and agree priorities with you." },
      { title: "Agree the approach", text: "Reminder timings, tone and when to escalate — all set by you." },
      { title: "Chase every week", text: "Reminders and calls on schedule, with payments matched as they arrive." },
      { title: "Report each month", text: "An aged-debtor summary and any accounts that need your attention." },
    ],
    faqs: [
      {
        question: "Will you contact our customers in your name or ours?",
        answer:
          "Usually in yours — from a shared address such as accounts@yourcompany — so customers deal with your business as normal. We agree the wording with you first.",
      },
      {
        question: "How firm will you be?",
        answer:
          "As firm as you want. We agree a reminder schedule and an escalation point, and we always check with you before taking any step beyond polite reminders.",
      },
      {
        question: "Do you raise our sales invoices too?",
        answer:
          "We can. Many clients ask us to raise invoices as well as chase them, so the whole process from invoice to payment is handled in one place.",
      },
    ],
    related: ["accounts-payable", "management-accounts", "bookkeeping-services", "outsourced-financial-operations"],
    illustration: "credit-control",
  },
  {
    slug: "management-accounts",
    href: "/services/management-accounts",
    name: "Management accounts",
    category: "operations",
    summary: "Clear monthly reports on profit, cash and performance.",
    eyebrow: "Management accounts services",
    title: "Know how the business is doing — every month.",
    lede: "Management accounts show you profit, cash and what's owed while there's still time to act. We prepare a clear monthly pack, explain what's changed and answer your questions.",
    metaTitle: "Management Accounts Services",
    metaDescription:
      "Monthly management accounts for growing UK businesses: profit and loss, balance sheet, cash and key figures, with plain-English commentary.",
    tool: { kind: "scoping", key: "management-accounts" },
    calculatorTitle: "Design your monthly report",
    calculatorIntro:
      "Choose how often you'd like reports and what they should include. We'll summarise the pack and send a tailored quote.",
    explanation: [
      "Year-end accounts tell you what happened months ago. Management accounts tell you what's happening now: whether you made a profit last month, where the cash went and which customers still owe you.",
      "We prepare the pack from reconciled books, so the figures are reliable. Each report comes with a short commentary in plain English, and we're happy to walk you through it.",
    ],
    includes: [
      { title: "Profit and loss", text: "Income and costs for the month and the year to date, compared with last year where useful." },
      { title: "Balance sheet", text: "What the business owns and owes, reviewed and reconciled before it reaches you." },
      { title: "Cash position", text: "Where cash came from and went, and the balance at month-end." },
      { title: "Budget vs actual", text: "How the month compares with your budget, with the main differences explained." },
      { title: "Key figures", text: "The handful of numbers that matter most for your business, tracked month by month." },
      { title: "Plain-English commentary", text: "A short note on what changed and what to keep an eye on." },
    ],
    benefits: [
      { title: "Better decisions", text: "Hiring, pricing and spending decisions based on current numbers." },
      { title: "No year-end surprises", text: "You see profit building through the year, so tax and results aren't a shock." },
      { title: "Ready for lenders and investors", text: "A consistent monthly pack you can share with confidence." },
    ],
    goodFit: [
      "You only see your numbers at year-end",
      "You have a board, investors or a lender who expect regular reports",
      "Your figures change a lot from month to month and you don't know why",
      "Your finance manager needs more time for analysis",
    ],
    steps: [
      { title: "Agree what matters", text: "We talk through the figures you use to run the business." },
      { title: "Tidy the books", text: "We make sure the accounts are reconciled and set up to report what you need." },
      { title: "Report every month", text: "Your pack arrives on an agreed working day after month-end." },
      { title: "Talk it through", text: "A short call to go through the numbers whenever you'd like one." },
    ],
    faqs: [
      {
        question: "When will we receive the reports?",
        answer:
          "We agree a working day with you — usually within the first two weeks of the following month, once the books are reconciled.",
      },
      {
        question: "Can you report across several companies?",
        answer: "Yes. We can prepare reports for each company and a combined overview. See our group companies service for more.",
      },
      {
        question: "Do we need our bookkeeping done by you as well?",
        answer:
          "Not necessarily, but reliable reports need reliable books. If someone else keeps your records, we'll review them before preparing the pack.",
      },
    ],
    related: ["month-end-close", "group-companies", "outsourced-financial-operations", "credit-control"],
    illustration: "management-accounts",
  },
  {
    slug: "month-end-close",
    href: "/services/month-end-close",
    name: "Month-end close",
    category: "operations",
    summary: "Reconciled, reviewed books ready for reporting every month.",
    eyebrow: "Month-end close",
    title: "A tidy close, every month.",
    lede: "We work through a clear month-end checklist — reconciliations, accruals, payroll and VAT — so your books are complete, reviewed and ready for reporting on time.",
    metaTitle: "Month-End Close Services",
    metaDescription:
      "Outsourced month-end close for growing businesses: bank reconciliations, accruals, payroll journals, VAT and balance sheet review on a reliable timetable.",
    tool: { kind: "scoping", key: "month-end-close" },
    calculatorTitle: "Plan your month-end",
    calculatorIntro:
      "Tell us how month-end works today and what it should cover. We'll summarise the close and send you a tailored quote.",
    explanation: [
      "If month-end drags on for weeks, or never really finishes, your reports are late and nobody fully trusts them. Usually the problem is a lack of routine rather than a lack of effort.",
      "We introduce a written checklist and work through it every month on a fixed timetable. Each balance is reconciled and reviewed, so the figures that reach you are complete and dependable.",
    ],
    includes: [
      { title: "Bank and card reconciliations", text: "Every account matched to statements, with differences investigated." },
      { title: "Accruals and prepayments", text: "Costs recorded in the right month, so profit isn't distorted." },
      { title: "Payroll journals", text: "Wages, tax and pension costs posted correctly each month." },
      { title: "VAT control", text: "The VAT account checked so returns and the balance sheet agree." },
      { title: "Fixed assets", text: "Purchases capitalised and depreciation posted where needed." },
      { title: "Balance sheet review", text: "A final review of every balance before the month is closed." },
    ],
    benefits: [
      { title: "Reports on time", text: "A fixed timetable means your numbers arrive when you expect them." },
      { title: "Numbers you trust", text: "Every balance reconciled and reviewed, not estimated." },
      { title: "An easier year-end", text: "Twelve clean month-ends make the year-end accounts much simpler." },
    ],
    goodFit: [
      "Month-end takes more than a couple of weeks",
      "Your balance sheet has balances nobody can explain",
      "Your finance manager is stretched at the end of every month",
      "You want reliable monthly reporting",
    ],
    steps: [
      { title: "Review where you are", text: "We check the current state of your books and any catch-up needed." },
      { title: "Agree the checklist", text: "A written list of close tasks and a timetable that suits you." },
      { title: "Close every month", text: "We work through the checklist and keep evidence for each reconciliation." },
      { title: "Hand over for reporting", text: "Reviewed, closed books — ready for your management accounts." },
    ],
    faqs: [
      {
        question: "How quickly can the month be closed?",
        answer:
          "It depends on how quickly bank statements, payroll and supplier information are available. Once the routine is running, we agree a working day and stick to it.",
      },
      {
        question: "Can you close the month alongside our finance team?",
        answer:
          "Yes. We can take on specific tasks — such as reconciliations and journals — while your team handles the rest, or run the whole close.",
      },
    ],
    related: ["management-accounts", "bookkeeping-services", "accounts-payable", "group-companies"],
    illustration: "month-end-close",
  },
  {
    slug: "accounting-systems",
    href: "/services/accounting-systems",
    name: "Accounting systems",
    category: "support",
    summary: "Xero and QuickBooks set up properly, with the right apps connected.",
    eyebrow: "Accounting systems",
    title: "Less typing. Better records.",
    lede: "We help you get the most from Xero or QuickBooks — setting them up properly, connecting your bank and other apps, and cutting out repetitive manual work.",
    metaTitle: "Xero & QuickBooks Setup and Integrations",
    metaDescription:
      "Xero and QuickBooks setup, migration and integrations for UK businesses: bank feeds, invoice capture, payroll and e-commerce connections, plus team training.",
    tool: { kind: "scoping", key: "accounting-systems" },
    calculatorTitle: "Tell us about your systems",
    calculatorIntro:
      "What do you use today, and what would you like to change? We'll summarise the work and send a tailored quote.",
    explanation: [
      "Many businesses use accounting software but still type in most of the data. Bank feeds aren't set up, receipts are keyed in by hand and sales from other systems are copied over line by line.",
      "We set up Xero or QuickBooks properly and connect the tools you already use, so data flows in automatically and your team spends less time on data entry.",
    ],
    includes: [
      { title: "Setup and migration", text: "A clean move to Xero or QuickBooks, including opening balances and history where needed." },
      { title: "Chart of accounts", text: "Accounts organised around how your business works and reports." },
      { title: "Bank feeds and rules", text: "Bank and card feeds connected, with rules for regular transactions." },
      { title: "App connections", text: "Invoice capture, payroll, payment providers and e-commerce platforms linked to your ledger." },
      { title: "Approvals and access", text: "The right people with the right permissions." },
      { title: "Training", text: "Practical training so your team knows how to use the system day to day." },
    ],
    benefits: [
      { title: "Less manual work", text: "Data arrives automatically instead of being typed in." },
      { title: "Fewer mistakes", text: "Fewer manual steps means fewer errors to find and fix." },
      { title: "Room to grow", text: "A setup that copes with more transactions without more staff." },
    ],
    goodFit: [
      "You're still using spreadsheets or old desktop software",
      "Your team re-keys data from other systems",
      "Your Xero or QuickBooks setup has grown messy",
      "You've added a new sales channel or company",
    ],
    steps: [
      { title: "Review your setup", text: "We look at your current software, apps and how data moves between them." },
      { title: "Agree a plan", text: "What to change, what to connect and in what order." },
      { title: "Set it up", text: "We configure the system and connections, and test them with real data." },
      { title: "Train your team", text: "Short, practical sessions so everyone is confident." },
    ],
    faqs: [
      {
        question: "Should we use Xero or QuickBooks?",
        answer:
          "Both are good choices for most UK businesses. The right one depends on the apps you use, how you invoice and what your team is comfortable with. We'll give you a straight recommendation.",
      },
      {
        question: "Can you move our historical data?",
        answer:
          "Yes. We agree how much history to bring across — often opening balances plus the current year — and check that everything reconciles after the move.",
      },
      {
        question: "Do we have to change software?",
        answer: "No. Often the quickest win is tidying up and connecting the software you already use.",
      },
    ],
    related: ["bookkeeping-services", "accounts-payable", "month-end-close", "outsourced-financial-operations"],
    illustration: "accounting-systems",
  },
  {
    slug: "group-companies",
    href: "/services/group-companies",
    name: "Group companies",
    category: "support",
    summary: "Bookkeeping and reporting across several companies.",
    eyebrow: "Group company accounting",
    title: "More than one company? We can help.",
    lede: "We help businesses manage bookkeeping, reporting and day-to-day finance work across multiple companies.",
    metaTitle: "Group Company Accounting & Multi-Entity Bookkeeping",
    metaDescription:
      "Bookkeeping, intercompany reconciliations and consistent monthly reporting for groups of companies — holding companies, subsidiaries and property SPVs.",
    tool: { kind: "scoping", key: "group-companies" },
    calculatorTitle: "Tell us about your group",
    calculatorIntro:
      "How many companies, how they trade with each other and the reporting you need. We'll summarise the work and send a tailored quote.",
    explanation: [
      "Every extra company adds another set of books, more bank accounts and transactions between companies that have to agree. Without a consistent approach, it becomes hard to see how the group as a whole is doing.",
      "We keep separate, reconciled books for each company, make sure intercompany balances match and prepare consistent monthly reports — for each company and, where you need it, a group overview. We work alongside your accountant on year-end and tax.",
    ],
    includes: [
      { title: "Separate books for each company", text: "Every company's records kept and reconciled in its own right." },
      { title: "Intercompany reconciliations", text: "Balances between companies checked each month so they always agree." },
      { title: "Consistent reporting", text: "The same chart of accounts and report layout across the group." },
      { title: "Holding companies and subsidiaries", text: "Management charges, recharges and dividends between companies recorded correctly." },
      { title: "Payables and receivables", text: "Suppliers paid and customers chased across every company." },
      { title: "Group overview", text: "A combined monthly view of revenue, costs and cash across the group." },
      { title: "Working with your accountant", text: "Clean records and schedules for your accountant at year-end." },
      { title: "Support as you grow", text: "New companies brought into the same setup as your structure changes." },
    ],
    benefits: [
      { title: "See the whole group", text: "One view of performance and cash, not a pile of separate spreadsheets." },
      { title: "Balances that agree", text: "Intercompany differences dealt with monthly, not discovered at year-end." },
      { title: "One team for every company", text: "A single point of contact for the finance work across your group." },
    ],
    goodFit: [
      "You own a holding company with trading subsidiaries",
      "You run several property SPVs or trading companies",
      "Money and recharges move between your companies",
      "You want one consistent monthly view of the group",
    ],
    steps: [
      { title: "Map the structure", text: "We understand how your companies relate and how money moves between them." },
      { title: "Make the setup consistent", text: "A common chart of accounts and reporting layout across the group." },
      { title: "Run each company monthly", text: "Bookkeeping, reconciliations and intercompany checks for every entity." },
      { title: "Report on the group", text: "Company reports plus a group overview, on an agreed timetable." },
    ],
    faqs: [
      {
        question: "Do you prepare statutory consolidated accounts?",
        answer:
          "Our focus is the day-to-day bookkeeping and monthly reporting across your companies. If your group needs statutory consolidated accounts or specialist tax advice, we'll work alongside your accountant and give them clean, reconciled records.",
      },
      {
        question: "Our companies use different software. Is that a problem?",
        answer:
          "Not at all to start with. We can work across different systems and, if it helps, plan a move onto a consistent setup over time.",
      },
      {
        question: "Can you add new companies as we grow?",
        answer: "Yes. New companies are set up the same way as the rest of the group, so reporting stays consistent.",
      },
    ],
    related: ["management-accounts", "month-end-close", "accounts-payable", "outsourced-financial-operations"],
    illustration: "group-companies",
    illustrationPlacement: "section",
    illustrationTitle: "Every company's numbers, brought together",
  },
];
