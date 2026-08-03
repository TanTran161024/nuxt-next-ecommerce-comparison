import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Shoe Shop Comparison',
  description: 'Placeholder Next.js application for framework comparison.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body className="mx-auto min-h-screen max-w-3xl px-6 py-16">{children}</body>
    </html>
  )
}
