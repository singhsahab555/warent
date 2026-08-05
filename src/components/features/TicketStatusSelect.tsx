'use client'

import { useTransition } from 'react'
import { updateTicketStatus } from '@/lib/actions/support-admin'

const statusStyles: Record<string, string> = {
  open: 'bg-red-50 text-red-600',
  in_progress: 'bg-amber-50 text-amber-700',
  resolved: 'bg-accent-50 text-accent-700',
}

export default function TicketStatusSelect({
  ticketId,
  status,
}: {
  ticketId: string
  status: string
}) {
  const [isPending, startTransition] = useTransition()

  return (
    <select
      value={status}
      disabled={isPending}
      onChange={(e) =>
        startTransition(() => {
          updateTicketStatus(ticketId, e.target.value as 'open' | 'in_progress' | 'resolved')
        })
      }
      className={`rounded-full border-0 px-3 py-1.5 text-xs font-bold capitalize ${statusStyles[status] ?? statusStyles.open}`}
    >
      <option value="open">Open</option>
      <option value="in_progress">In progress</option>
      <option value="resolved">Resolved</option>
    </select>
  )
}
