import LegalPageLayout from '@/components/legal/LegalPageLayout'
import { Section, SubList } from '@/components/legal/LegalComponents'

export default function PrivacyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="August 4, 2026">
      <p>
        This Policy explains what information WARENT collects, how it&rsquo;s used, and who it&rsquo;s
        shared with. We collect only what&rsquo;s needed to operate the marketplace and process
        bookings and payments.
      </p>

      <Section number="1." title="Information we collect">
        <p>Directly from you, when you create an account or use the Platform:</p>
        <SubList
          items={[
            'Name, email address, phone number, and password (stored securely, never in plain text).',
            'Business details for Lenders, including GSTIN and verification documents (uploaded photos/PDFs).',
            'Warehouse listing details: address, coordinates, area, pricing, and photos.',
            'Booking details: dates, amounts, and payment status.',
          ]}
        />
        <p>Automatically:</p>
        <SubList
          items={[
            'Basic usage data (pages visited, actions taken) for debugging and improving the Platform.',
          ]}
        />
      </Section>

      <Section number="2." title="How we use your information">
        <SubList
          items={[
            'To create and manage your account, and route you to the correct dashboard based on your role.',
            'To process bookings, calculate pricing/commission, and prevent double-bookings.',
            'To process payments and refunds via our payment partners.',
            'To verify Lender identity and warehouse legitimacy before listings go live.',
            'To send transactional emails (booking confirmations, verification status, payout notices).',
          ]}
        />
      </Section>

      <Section number="3." title="Who we share it with">
        <p>
          We do not sell your personal data. We share information only with the service
          providers necessary to operate WARENT:
        </p>
        <SubList
          items={[
            'Supabase — our database and authentication provider, which stores your account and booking data securely with row-level access controls.',
            'Razorpay and Stripe — our payment processors, who handle your payment details directly. WARENT never stores your card number or full payment credentials.',
            'Resend — our email delivery provider, used to send transactional emails.',
          ]}
        />
        <p>
          Lenders and Renters can see limited information about each other necessary to complete
          a booking (e.g., a Renter&rsquo;s name and phone number are visible to the Lender whose
          slot they book).
        </p>
      </Section>

      <Section number="4." title="Data security">
        <p>
          Access to your data is restricted using database-level Row Level Security — Lenders can
          only see and manage their own listings, Renters can only see their own bookings, and
          administrative access is limited to verified admin accounts.
        </p>
      </Section>

      <Section number="5." title="Data retention">
        <p>
          We retain account and booking data for as long as your account is active, and as needed
          to comply with tax, accounting, and legal obligations after account closure. You may
          request deletion of your account by contacting support, subject to records we&rsquo;re
          legally required to retain.
        </p>
      </Section>

      <Section number="6." title="Your rights">
        <SubList
          items={[
            'Access the personal data we hold about you.',
            'Request correction of inaccurate information.',
            'Request deletion of your account, subject to legal retention requirements.',
            'Withdraw consent for non-essential communications at any time.',
          ]}
        />
      </Section>

      <Section number="7." title="Changes to this Policy">
        <p>
          We may update this Policy as the Platform evolves. Material changes will be reflected
          here with an updated date.
        </p>
      </Section>

      <Section number="8." title="Contact">
        <p>
          For privacy-related questions or data requests, reach out through the contact details
          in your account dashboard.
        </p>
      </Section>
    </LegalPageLayout>
  )
}
