'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function FileUploadField({
  bucket,
  pathPrefix,
  label,
  accept = 'image/*,.pdf',
  currentUrl,
  onUploaded,
}: {
  bucket: 'verification-docs' | 'warehouse-photos'
  pathPrefix: string // typically the user's own id — required by storage RLS policies
  label: string
  accept?: string
  currentUrl?: string | null
  onUploaded: (url: string) => void
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl ?? null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)

    if (file.size > 10 * 1024 * 1024) {
      setError('File must be under 10MB')
      return
    }

    setUploading(true)

    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop()
      const fileName = `${crypto.randomUUID()}.${ext}`
      // Storage RLS requires the first path segment to match auth.uid() —
      // pathPrefix must be the current user's id, enforced by the calling page.
      const path = `${pathPrefix}/${fileName}`

      const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      })

      if (uploadError) {
        setError(uploadError.message)
        setUploading(false)
        return
      }

      if (bucket === 'warehouse-photos') {
        // Public bucket — direct public URL works
        const { data } = supabase.storage.from(bucket).getPublicUrl(path)
        setPreviewUrl(data.publicUrl)
        onUploaded(data.publicUrl)
      } else {
        // Private bucket — generate a signed URL (valid long-term for admin review)
        const { data, error: signError } = await supabase.storage
          .from(bucket)
          .createSignedUrl(path, 60 * 60 * 24 * 365) // 1 year

        if (signError || !data) {
          setError('Uploaded, but could not generate a viewable link')
          setUploading(false)
          return
        }
        setPreviewUrl(data.signedUrl)
        onUploaded(data.signedUrl)
      }
    } catch (err) {
      setError('Upload failed — please try again')
    } finally {
      setUploading(false)
    }
  }

  const isImage = previewUrl && /\.(jpe?g|png|webp|gif)(\?|$)/i.test(previewUrl)

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {previewUrl && (
        <div className="mt-2 flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-2">
          {isImage ? (
            <img src={previewUrl} alt="Uploaded file" className="h-14 w-14 rounded-md object-cover" />
          ) : (
            <span className="flex h-14 w-14 items-center justify-center rounded-md bg-gray-200 text-xl">📄</span>
          )}
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-brand-600 underline"
          >
            View uploaded file
          </a>
        </div>
      )}

      <div className="mt-2">
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          disabled={uploading}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-brand-700 hover:file:bg-brand-100 disabled:opacity-50"
        />
      </div>

      {uploading && <p className="mt-1 text-xs text-gray-400">Uploading…</p>}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}
