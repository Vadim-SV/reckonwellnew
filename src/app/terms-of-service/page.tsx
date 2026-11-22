import type { Metadata } from "next";
import { LegalPage, Section } from "@/components/sections/LegalPage";

// Wording carried over unchanged from the original reckonwell.com terms of service.
export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms of service that apply to Reckonwell Ltd's accounting, bookkeeping and financial operations services.",
  alternates: { canonical: "/terms-of-service" },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" href="/terms-of-service">
      <Section number="1" title="Services">
        <p>
          We will provide you with the accounting services specified in our engagement letter. We will perform these
          services with due care and skill in accordance with the relevant professional standards. We will maintain the
          confidentiality of all information that you provide to us.
        </p>
      </Section>

      <Section number="2" title="Fees">
        <p>
          We will charge you fees for our services at our standard rates, as set out in our engagement letter. We will
          notify you in advance of any expenses that we incur in connection with the provision of our services, such as
          travel expenses or out-of-pocket expenses. We will invoice you for our fees and expenses on a regular basis,
          as set out in our engagement letter.
        </p>
      </Section>

      <Section number="3" title="Subscription Fees">
        <p>
          You will be charged a subscription fee for our services on a monthly or annual basis, as specified in our
          engagement letter. The subscription fee will be payable in advance for the relevant subscription period.
        </p>
      </Section>

      <Section number="4" title="Automatic Renewal">
        <p>
          Your subscription will automatically renew at the end of each subscription period, unless you give us written
          notice that you wish to terminate your subscription. If your subscription is renewed, we will automatically
          charge your nominated payment method for the relevant subscription fee.
        </p>
      </Section>

      <Section number="5" title="Payment Method">
        <p>
          You must nominate a payment method for the payment of your subscription fee, such as a credit card or direct
          debit. You must ensure that your nominated payment method is valid and up to date at all times. If we are
          unable to process your payment due to an invalid or expired payment method, we may suspend or terminate your
          subscription.
        </p>
      </Section>

      <Section number="6" title="Late Payment">
        <p>
          If you fail to pay your subscription fee on time, we reserve the right to suspend or terminate your
          subscription. We may also charge interest on any unpaid amounts at a rate of 5% per month or part thereof.
        </p>
      </Section>

      <Section number="7" title="Refunds">
        <p>We do not provide refunds for any subscription fees that have been paid, unless required by law.</p>
      </Section>

      <Section number="8" title="Termination">
        <p>
          You may terminate our engagement at any time by giving us written notice. If you terminate our engagement, you
          will be liable for our fees and expenses up to the date of termination.
        </p>
        <p>
          We may terminate our engagement at any time by giving you written notice. If we terminate our engagement, we
          will refund any fees that you have paid in advance for services that we have not yet provided.
        </p>
      </Section>

      <Section number="9" title="Liability">
        <p>
          We will not be liable for any loss or damage that you may suffer as a result of any act or omission by us,
          unless that loss or damage is caused by our negligence or wilful misconduct. Our liability for any loss or
          damage that you may suffer as a result of our negligence or wilful misconduct will be limited to the fees that
          you have paid to us for the relevant services.
        </p>
      </Section>

      <Section number="10" title="Confidentiality">
        <p>
          We will keep all information that you provide to us confidential, except where we are required by law to
          disclose it or where you have given us permission to disclose it. We may use your information for the purposes
          of providing our services to you and for other purposes that you have authorised.
        </p>
      </Section>

      <Section number="11" title="Intellectual Property">
        <p>
          All intellectual property rights in any reports, documents, or other materials that we produce in connection
          with the provision of our services will remain our property. You may use these materials for your own internal
          purposes, but you may not use them for any other purpose without our prior written consent.
        </p>
      </Section>

      <Section number="12" title="Governing Law and Jurisdiction">
        <p>
          These terms and conditions will be governed by and construed in accordance with the laws of England and Wales.
          Any disputes arising under these terms and conditions will be subject to the exclusive jurisdiction of the
          courts of England and Wales.
        </p>
      </Section>

      <Section number="13" title="Amendments">
        <p>
          We may amend these terms and conditions at any time by giving you written notice. Your continued engagement of
          our services following receipt of such notice will constitute your acceptance of the amended terms and
          conditions.
        </p>
      </Section>

      <Section number="14" title="Entire Agreement">
        <p>
          These terms and conditions constitute the entire agreement between us and supersede all previous agreements or
          arrangements relating to the provision of our services. No variation of these terms and conditions will be
          effective unless it is in writing and signed by both parties.
        </p>
      </Section>
    </LegalPage>
  );
}
