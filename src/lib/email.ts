import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  if (!process.env.RESEND_API_KEY) {
    // Fail soft in dev if the key isn't configured yet — don't block the calling action.
    console.warn('RESEND_API_KEY not set — skipping email send:', subject)
    return { skipped: true }
  }

  try {
    await resend.emails.send({
      from: 'WARENT <notifications@warent.com>', // replace once you verify a domain in Resend
      to,
      subject,
      html,
    })
    return { skipped: false }
  } catch (err) {
    console.error('Failed to send email:', err)
    return { skipped: false, error: (err as Error).message }
  }
}
