import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SmoothScroll from '@/components/SmoothScroll'
import StickyContact from '@/components/StickyContact'

export const metadata: Metadata = {
  title: { default: 'NJ Motors', template: '%s | NJ Motors' },
  description:
    'Hand-picked, used cars from NJ Motors. Browse our current stock, see recently sold vehicles and enquire today.',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body className="pb-14 md:pb-0">
        <SmoothScroll>
          <Header />
          <main>{children}</main>
          <Footer />
          <StickyContact />
        </SmoothScroll>
      </body>
    </html>
  )
}
