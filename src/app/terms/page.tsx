import LegalPageLayout from '@/components/legal/LegalPageLayout'
import { Section, SubList, Highlight } from '@/components/legal/LegalComponents'

export default function TermsPage() {
  return (
    <LegalPageLayout title="Terms of Service" lastUpdated="August 6, 2026">
      <p>
        These Terms govern your use of WARENT (&ldquo;the Platform&rdquo;), operated as a
        marketplace connecting warehouse owners (&ldquo;Lenders&rdquo;) with businesses seeking
        short-term fractional storage space (&ldquo;Renters&rdquo;). By creating an account, you
        agree to these Terms.
      </p>

      <Section number="1." title="What WARENT is — and isn't">
        <p>
          WARENT is a marketplace and booking platform. We connect Lenders and Renters and
          facilitate payment, but <strong>WARENT does not own, operate, physically manage, or
          maintain</strong> any warehouse listed on the Platform. The contract for storage space
          is between the Lender and the Renter; WARENT is not a party to that storage
          arrangement.
        </p>
      </Section>

      <Section number="2." title="Accounts &amp; roles">
        <p>Every account is registered under one role: Lender, Renter, or Admin.</p>
        <SubList
          items={[
            'Lenders list warehouse space and fractional inventory slots, sized however suits their available capacity.',
            'Renters search and book available slots for a fixed date range.',
            'You are responsible for the accuracy of information you provide, including business details, GSTIN, and warehouse listings.',
          ]}
        />
      </Section>

      <Section number="3." title="Listings &amp; verification">
        <p>
          New Lender accounts and new warehouse listings are reviewed before appearing publicly
          on the Platform. WARENT reserves the right to reject, suspend, or remove any listing or
          account at its discretion, including for incomplete verification, suspected fraud, or
          policy violations.
        </p>
      </Section>

      <Section number="4." title="Maintenance, safety &amp; physical condition of the space">
        <p>
          <strong>The Lender is solely responsible</strong> for the physical condition,
          maintenance, cleanliness, security, and safety compliance (including fire safety and
          any applicable local regulations) of their listed warehouse space for the full duration
          of a Renter&rsquo;s booking. WARENT does not perform maintenance, cleaning, repairs, or
          on-site facility management at any listed location.
        </p>
        <p>
          Lenders must ensure their listing accurately reflects the space&rsquo;s real condition
          and amenities at the time of booking. If a Renter arrives to find the space materially
          different from what was listed, this should be reported to WARENT support immediately —
          we investigate such reports and may suspend a Lender&rsquo;s account for
          misrepresentation.
        </p>
      </Section>

      <Section number="5." title="Bookings &amp; pricing">
        <p>
          Renters pay a single all-inclusive price shown at checkout. Lenders receive a payout
          based on the rate they set when listing their space; WARENT&rsquo;s margin is built
          into the difference between the two and is not itemized separately at checkout. The
          full amount is collected from the Renter at the time of booking.
        </p>
        <Highlight>
          A booking is not confirmed until payment is successfully completed. Bookings left
          unpaid are automatically cancelled after a short window to free the slot for other
          Renters.
        </Highlight>
      </Section>

      <Section number="6." title="Cancellations &amp; refunds">
        <p>
          Cancellations are governed by our{' '}
          <a href="/refund-policy" className="font-semibold text-brand-600 underline">
            Refund Policy
          </a>
          , which sets out refund percentages based on how much notice is given before the
          booking&rsquo;s start date. By booking, you agree to that policy.
        </p>
      </Section>

      <Section number="7." title="Lender payouts">
        <p>
          Lenders receive the rate they listed for each completed, paid booking. Payouts are
          currently processed on a rolling basis following payment confirmation; Lenders can
          track owed and paid amounts from their Earnings dashboard.
        </p>
      </Section>

      <Section number="8." title="Prohibited use">
        <SubList
          items={[
            'Listing space you do not have the legal right to rent out.',
            'Circumventing the Platform to transact directly with a party you were connected to through WARENT.',
            'Storing illegal, hazardous, or prohibited goods without appropriate declared storage type and safety compliance.',
            'Uploading false or misleading verification documents, or listing photos that misrepresent the actual space.',
          ]}
        />
      </Section>

      <Section number="9." title="Limitation of liability">
        <p>
          WARENT is not liable for loss, theft, or damage to goods stored at a Lender&rsquo;s
          warehouse, the physical condition or maintenance of any listed space, disputes between
          Lenders and Renters, or indirect/consequential losses arising from use of the Platform.
          Responsibility for the physical space rests with the Lender as described in Section 4.
        </p>
      </Section>

      <Section number="10." title="Changes to these Terms">
        <p>
          We may update these Terms from time to time. Continued use of the Platform after an
          update constitutes acceptance of the revised Terms.
        </p>
      </Section>

      <Section number="11." title="Contact">
        <p>
          Questions about these Terms can be sent to our support team through the contact details
          provided in your account dashboard, or via our{' '}
          <a href="/contact" className="font-semibold text-brand-600 underline">Contact page</a>.
        </p>
      </Section>
    </LegalPageLayout>
  )
}
