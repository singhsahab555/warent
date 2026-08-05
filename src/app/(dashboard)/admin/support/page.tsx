import { getAllTickets } from '@/lib/queries/support'
import TicketStatusSelect from '@/components/features/TicketStatusSelect'

export default async function AdminSupportPage() {
  const tickets = await getAllTickets()

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink-900">Support tickets</h1>
      <p className="mt-1 text-sm text-gray-500">Messages submitted through the Contact page.</p>

      <div className="mt-6 space-y-3">
        {tickets.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
            <p className="text-sm text-gray-500">No support messages yet.</p>
          </div>
        ) : (
          tickets.map((t) => (
            <div key={t.id} className="rounded-2xl border border-black/5 bg-white p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-bold text-ink-900">{t.subject}</p>
                  <p className="text-xs text-gray-400">
                    {t.name} · {t.email} · {new Date(t.created_at).toLocaleDateString('en-IN')}
                  </p>
                  <p className="mt-2 text-sm text-gray-600">{t.message}</p>
                </div>
                <TicketStatusSelect ticketId={t.id} status={t.status} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
