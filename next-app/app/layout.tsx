import type { Metadata } from 'next'
import './globals.css'
import { AppFooter } from '../components/layout/AppFooter'
import { AppHeader } from '../components/layout/AppHeader'
import { CartProvider } from '../components/cart/CartProvider'
import { homeMetadata } from '../lib/metadata'

export const metadata: Metadata = homeMetadata

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body className="flex min-h-screen flex-col bg-slate-50"><CartProvider><AppHeader /><main className="flex-1">{children}</main></CartProvider><AppFooter /></body>
    </html>
  )
}
