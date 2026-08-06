'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import FileUploadField from '@/components/features/FileUploadField'
import { submitVerificationDocuments } from '@/lib/actions/verification'

export default function LenderVerificationPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [isVerified, setIsVerified] = useState(false)
  const [gstin, setGstin] = useState('')
  const [gstinDocUrl, setGstinDocUrl] = useState<string | null>(null)
  const [idDocUrl, setIdDocUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUserId(user.id)

      const { data: profile } = await supabase
        .from('users')
        .select('gstin, gstin_document_url, id_document_url, is_verified')
        .eq('id', user.id)
        .single()

      if (profile) {
        setGstin((profile as any).gstin ?? '')
        setGstinDocUrl((profile as any).gstin_document_url ?? null)
        setIdDocUrl((profile as any).id_document_url ?? null)
        setIsVerified((profile as any).is_verified ?? false)
      }
      setLoading(false)
    }
    load()
  }, [router])

  const handleSubmit = async () => {
    setError(null)
    setIsSubmitting(true)

    const result = await submitVerificationDocuments(null, {
      gstin: gstin || undefined,
      gstinDocumentUrl: gstinDocUrl || undefined,
      idDocumentUrl: idDocUrl || undefined,
    })

    setIsSubmitting(false)

    if (result?.error) {
      setError(result.error)
      return
    }

    setSuccess(true)
  }

  if (loading) {
    return <p className="text-sm text-gray-400">Loading…</p>
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-extrabold text-ink-900">Verification</h1>
      <p className="mt-1 text-sm text-gray-500">
        Upload your business documents so we can verify your account and approve your listings.
      </p>

      {isVerified && (
        <div className="mt-5 rounded-xl bg-accent-50 px-4 py-3 text-sm font-semibold text-accent-700">
          ✅ Your account is verified.
        </div>
      )}

      <div className="mt-6 space-y-5 rounded-2xl border border-black/5 bg-white p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">GSTIN (optional but recommended)</label>
          <input
            value={gstin}
            onChange={(e) => setGstin(e.target.value.toUpperCase())}
            placeholder="22AAAAA0000A1Z5"
            maxLength={15}
            className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
          />
        </div>

        {userId && (
          <>
            <FileUploadField
              bucket="verification-docs"
              pathPrefix={userId}
              label="GSTIN certificate / business proof"
              currentUrl={gstinDocUrl}
              onUploaded={setGstinDocUrl}
            />
            <FileUploadField
              bucket="verification-docs"
              pathPrefix={userId}
              label="Government ID (Aadhaar / PAN / etc.)"
              currentUrl={idDocUrl}
              onUploaded={setIdDocUrl}
            />
          </>
        )}

        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
        {success && (
          <p className="rounded-lg bg-accent-50 px-3 py-2 text-sm text-accent-700">
            Documents submitted — our team will review shortly.
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full rounded-full bg-brand-600 py-2.5 text-sm font-bold text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting…' : 'Submit for verification'}
        </button>
      </div>
    </div>
  )
}
