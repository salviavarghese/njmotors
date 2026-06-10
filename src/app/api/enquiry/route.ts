import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getPayloadClient } from '@/lib/payload'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, phone, message, vehicle } = body

    if (!name || (!email && !phone)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const payload = await getPayloadClient()

    // 1. ALWAYS save the enquiry first, so a lead is never lost even if email fails.
    await payload.create({
      collection: 'enquiries',
      data: { name, email, phone, message, vehicle: vehicle || undefined },
    })

    // 2. Look up the car title for a nicer email (optional).
    let vehicleTitle = ''
    if (vehicle) {
      try {
        const v = await payload.findByID({ collection: 'vehicles', id: vehicle })
        vehicleTitle = v?.title || ''
      } catch {
        /* ignore */
      }
    }

    // 3. Send the email. If this throws, the enquiry is still saved above.
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: process.env.ENQUIRY_FROM_EMAIL || 'onboarding@resend.dev',
        to: process.env.ENQUIRY_TO_EMAIL || 'owner@example.com',
        replyTo: email || undefined,
        subject: vehicleTitle ? `New enquiry: ${vehicleTitle}` : 'New website enquiry',
        text: [
          `Name: ${name}`,
          `Email: ${email || '—'}`,
          `Phone: ${phone || '—'}`,
          vehicleTitle ? `Vehicle: ${vehicleTitle}` : '',
          '',
          `Message:`,
          message || '(no message)',
        ]
          .filter(Boolean)
          .join('\n'),
      })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Enquiry error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
