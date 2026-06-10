'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function EnquiryForm({
  vehicleId,
  vehicleTitle,
  intro,
}: {
  vehicleId?: string
  vehicleTitle?: string
  intro?: string
}) {
  const router = useRouter()
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle')
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: vehicleTitle ? `I'm interested in the ${vehicleTitle}. Is it still available?` : '',
  })

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    if (!form.name || (!form.email && !form.phone)) {
      setStatus('error')
      return
    }
    setStatus('sending')
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, vehicle: vehicleId }),
      })
      if (!res.ok) throw new Error('failed')
      // CRO: clear confirmation, not a silent reload.
      router.push('/thank-you')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="rounded-xl border border-[var(--line)] bg-white p-5">
      <h3 className="text-lg font-bold text-[var(--brand)]">
        {vehicleTitle ? 'Enquire about this car' : 'Send us a message'}
      </h3>
      {intro && <p className="mt-1 text-sm text-[var(--muted)]">{intro}</p>}

      <div className="mt-4 space-y-3">
        <input
          className="w-full rounded-lg border border-[var(--line)] px-3 py-2 text-sm"
          placeholder="Your name *"
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            className="w-full rounded-lg border border-[var(--line)] px-3 py-2 text-sm"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
          />
          <input
            className="w-full rounded-lg border border-[var(--line)] px-3 py-2 text-sm"
            placeholder="Email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
          />
        </div>
        <textarea
          className="w-full rounded-lg border border-[var(--line)] px-3 py-2 text-sm"
          rows={3}
          placeholder="Message"
          value={form.message}
          onChange={(e) => update('message', e.target.value)}
        />

        {status === 'error' && (
          <p className="text-sm text-[var(--brand-accent)]">
            Please add your name and a phone or email so we can reply.
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={status === 'sending'}
          className="w-full rounded-lg bg-[var(--brand-accent)] py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {status === 'sending' ? 'Sending…' : 'Send enquiry'}
        </button>
        <p className="text-center text-xs text-[var(--muted)]">
          We&apos;ll only use your details to reply about this car.
        </p>
      </div>
    </div>
  )
}
