import type { Metadata } from 'next'
import './globals.css'
import { AppFooter } from '../components/layout/AppFooter'
import { AppHeader } from '../components/layout/AppHeader'
import { CartProvider } from '../components/cart/CartProvider'

export const metadata: Metadata = {
  title: 'Bước Chân Demo | Giày dép phục vụ nghiên cứu', description: 'Website giày dép demo phục vụ nghiên cứu so sánh Nuxt và Next.js.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body className="flex min-h-screen flex-col bg-slate-50"><CartProvider><AppHeader /><main className="flex-1">{children}</main></CartProvider><AppFooter /></body>
    </html>
  )
}
