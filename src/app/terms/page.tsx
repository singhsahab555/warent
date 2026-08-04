import LegalPageLayout from '@/components/legal/LegalPageLayout'
import { Section, SubList, Highlight } from '@/components/legal/LegalComponents'

export default function TermsPage() {
  return (
    <LegalPageLayout title="Terms of Service" lastUpdated="August 4, 2026">
      <p>
        These Terms govern your use of WARENT (&ldquo;the Platform&rdquo;), operated as a
        marketplace connecting warehouse owners (&ldquo;Lenders&rdquo;) with businesses seeking
        short-term fractional storage space (&ldquo;Renters&rdquo;). By creating an account, you
        agree to these Terms.
      </p>

      <Section number="1." title="What WARENT is — and isn't">
        <p>
          WARENT is a marketplace and booking platform. We connect Lenders and Renters and
          facilitate payment, but <strong>WARENT does not own, operate, or physically manage</strong>{' '}
          any warehouse listed on the Platform. The contract for storage space is between the
          Lender and the Renter; WARENT is not a party to that storage arrangement, and does not
          guarantee the condition, security, or suitability of any listed space.
        </p>
      </Section>

      <Section number="2." title="Accounts &amp; roles">
        <p>Every account is registered under one role: Lender, Renter, or Admin.</p>
        <SubList
          items={[
            'Lenders list warehouse space and fractional inventory slots (50–500 sqft) for short-term rental.',
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

      <Section number="4." title="Bookings &amp; pricing">
        <p>
          When a Renter books a slot, the price shown includes the Lender&rsquo;s rate plus
          WARENT&rsquo;s platform commission (currently 12% of the base rental amount). The full
          amount is collected from the Renter at the time of booking.
        </p>
        <Highlight>
          A booking is not confirmed until payment is successfully completed. Bookings left
          unpaid are automatically cancelled after a short window to free the slot for other
          Renters.
        </Highlight>
      </Section>

      <Section number="5." title="Cancellations &amp; refunds">
        <p>
          Cancellations are governed by our{' '}
          <a href="/refund-policy" className="font-semibold text-brand-600 underline">
            Refund Policy
          </a>
          , which sets out refund percentages based on how much notice is given before the
          booking&rsquo;s start date. By booking, you agree to that policy.
        </p>
      </Section>

      <Section number="6." title="Lender payouts">
        <p>
          Lenders receive the base rental amount (total booking amount minus WARENT&rsquo;s
          commission) for each completed, paid booking. Payouts are currently processed manually
          by WARENT on a rolling basis following payment confirmation; Lenders can track owed and
          paid amounts from their Earnings dashboard.
        </p>
      </Section>

      <Section number="7." title="Prohibited use">
        <SubList
          items={[
            'Listing space you do not have the legal right to rent out.',
            'Circumventing the Platform to transact directly and avoid commission after being connected through WARENT.',
            'Storing illegal, hazardous, or prohibited goods without appropriate declared storage type and safety compliance.',
            'Uploading false or misleading verification documents.',
          ]}
        />
      </Section>

      <Section number="8." title="Limitation of liability">
        <p>
          WARENT is not liable for loss, theft, or damage to goods stored at a Lender&rsquo;s
          warehouse, disputes between Lenders and Renters over the physical condition of a space,
          or indirect/consequential losses arising from use of the Platform. Our total liability
          in any dispute is limited to the platform commission earned on the booking in question.
        </p>
      </Section>

      <Section number="9." title="Changes to these Terms">
        <p>
          We may update these Terms from time to time. Continued use of the Platform after an
          update constitutes acceptance of the revised Terms.
        </p>
      </Section>

      <Section number="10." title="Contact">
        <p>
          Questions about these Terms can be sent to our support team through the contact details
          provided in your account dashboard.
        </p>
      </Section>
    </LegalPageLayout>
  )
}
