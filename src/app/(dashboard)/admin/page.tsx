import { createClient } from '@/lib/supabase/server'
import ApprovalButtons from '@/components/features/ApprovalButtons'
import { approveLender, rejectLender, approveWarehouse, rejectWarehouse } from '@/lib/actions/admin'

type PendingLender = {
  id: string
  full_name: string
  email: string
  phone: string
  gstin: string | null
  gstin_document_url: string | null
  created_at: string
}

type PendingWarehouse = {
  id: string
  name: string
  city: string
  state: string
  lender_id: string
  created_at: string
}

export default async function AdminPage() {
  const supabase = await createClient()

  const { data: pendingLenders } = await supabase
    .from('admin_pending_lenders' as any)
    .select('*')
    .order('created_at', { ascending: false }) as unknown as { data: PendingLender[] | null }

  const { data: pendingWarehouses } = await supabase
    .from('admin_pending_warehouses' as any)
    .select('*')
    .order('created_at', { ascending: false }) as unknown as { data: PendingWarehouse[] | null }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-extrabold text-ink-900">Pending approvals</h1>
        <p className="mt-1 text-sm text-gray-500">Review new lenders and warehouse listings.</p>
      </div>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400">
          Lenders awaiting verification ({pendingLenders?.length ?? 0})
        </h2>
        {!pendingLenders || pendingLenders.length === 0 ? (
          <EmptyState text="No lenders waiting on verification." />
        ) : (
          <div className="mt-3 space-y-3">
            {pendingLenders.map((l) => (
              <div
                key={l.id}
                className="flex items-center justify-between rounded-2xl border border-black/5 bg-white p-4"
              >
                <div>
                  <p className="font-bold text-ink-900">{l.full_name}</p>
                  <p className="text-sm text-gray-500">{l.email} · {l.phone}</p>
                  <p className="mt-1 text-xs text-gray-400">
                    GSTIN: {l.gstin ?? 'not provided'}
                    {l.gstin_document_url && (
                      <>
                        {' · '}
                        <a href={l.gstin_document_url} target="_blank" className="font-semibold text-brand-600 underline">
                          view document
                        </a>
                      </>
                    )}
                  </p>
                </div>
                <ApprovalButtons id={l.id} onApprove={approveLender} onReject={rejectLender} />
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400">
          Warehouses awaiting review ({pendingWarehouses?.length ?? 0})
        </h2>
        {!pendingWarehouses || pendingWarehouses.length === 0 ? (
          <EmptyState text="No warehouses waiting on review." />
        ) : (
          <div className="mt-3 space-y-3">
            {pendingWarehouses.map((w) => (
              <div
                key={w.id}
                className="flex items-center justify-between rounded-2xl border border-black/5 bg-white p-4"
              >
                <div>
                  <p className="font-bold text-ink-900">{w.name}</p>
                  <p className="text-sm text-gray-500">{w.city}, {w.state}</p>
                </div>
                <ApprovalButtons id={w.id} onApprove={approveWarehouse} onReject={rejectWarehouse} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="mt-3 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center">
      <p className="text-sm text-gray-500">{text}</p>
    </div>
  )
}
