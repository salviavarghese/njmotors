import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

export default function ThankYou() {
  return (
    <div className="mx-auto grid max-w-xl place-items-center px-4 py-28 text-center">
      <CheckCircle2 size={56} className="text-green-600" />
      <h1 className="mt-4 text-3xl font-extrabold text-[var(--brand)]">Thanks — we’ve got it.</h1>
      <p className="mt-2 text-[var(--muted)]">
        Your enquiry is in and we’ll be in touch as soon as we can, usually the same day during
        opening hours.
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/stock" className="rounded-full bg-[var(--brand-accent)] px-6 py-3 font-semibold text-white">
          Keep browsing
        </Link>
        <Link href="/" className="rounded-full border border-[var(--line)] px-6 py-3 font-semibold">
          Back home
        </Link>
      </div>
    </div>
  )
}
