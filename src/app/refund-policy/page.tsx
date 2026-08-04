import LegalPageLayout from '@/components/legal/LegalPageLayout'
import { Section, Highlight, PolicyTable } from '@/components/legal/LegalComponents'

export default function RefundPolicyPage() {
  return (
    <LegalPageLayout title="Refund Policy" lastUpdated="August 4, 2026">
      <p>
        This policy explains what you get back if you cancel a confirmed booking. It applies
        automatically and consistently to every booking on WARENT — the same calculation is
        enforced by our system at the moment a refund is processed, so the amount you see quoted
        is exactly what you&rsquo;ll receive.
      </p>

      <Section number="1." title="Refund tiers">
        <p>
          Your refund amount depends on how many days&rsquo; notice you give before the
          booking&rsquo;s start date:
        </p>
        <PolicyTable
          rows={[
            {
              tier: '7 or more days',
              refund: '90%',
              note: 'A small platform + processing fee is retained.',
            },
            {
              tier: '3–6 days',
              refund: '50%',
              note: 'The slot may be difficult to re-list on short notice.',
            },
            {
              tier: '0–2 days / after start date',
              refund: 'Non-refundable',
              note: 'The Lender has already reserved the space for you.',
            },
          ]}
        />
      </Section>

      <Section number="2." title="Why we don't refund 100%">
        <p>
          When a booking is cancelled, WARENT and our payment partners have already incurred
          costs (payment processing fees are not returned by the payment gateway even on a
          refund) and the Lender has held the slot unavailable for other Renters. The tiered
          policy balances fairness to Renters who cancel with real notice against the real costs
          incurred by cancelling.
        </p>
      </Section>

      <Section number="3." title="How refunds are processed">
        <p>
          Refunds are issued back to your original payment method (card, UPI, netbanking,
          depending on how you paid) via Razorpay or Stripe. Processing typically takes 5–7
          business days to reflect, depending on your bank.
        </p>
        <Highlight>
          Once a refund is approved, the corresponding slot and dates are released and become
          available for other Renters to book.
        </Highlight>
      </Section>

      <Section number="4." title="Requesting a cancellation">
        <p>
          To cancel a confirmed booking, contact support through your account dashboard with your
          booking reference. Our team will confirm the eligible refund amount per the tiers above
          before processing.
        </p>
      </Section>

      <Section number="5." title="Non-refundable circumstances">
        <p>
          Bookings are not eligible for any refund if cancellation is requested after the storage
          period has already begun, or if the booking is cancelled due to a violation of our{' '}
          <a href="/terms" className="font-semibold text-brand-600 underline">Terms of Service</a>{' '}
          (for example, storing prohibited goods).
        </p>
      </Section>

      <Section number="6." title="Lender-side cancellations">
        <p>
          If a Lender cancels a confirmed booking (rather than the Renter), the Renter is entitled
          to a full 100% refund regardless of notice period, since the cancellation was not the
          Renter&rsquo;s choice.
        </p>
      </Section>
    </LegalPageLayout>
  )
}
