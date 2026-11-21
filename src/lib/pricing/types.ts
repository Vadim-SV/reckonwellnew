export type LineItem = {
  label: string;
  amount: number;
  /** Optional qualifier, e.g. a multiplier such as "×1.3". */
  note?: string;
};

/**
 * Status of a pricing rule set. Nothing should be shown to customers as a
 * binding quotation until its rules are marked "approved" by Reckonwell.
 */
export type PricingApproval = "recovered-unapproved" | "approved";
