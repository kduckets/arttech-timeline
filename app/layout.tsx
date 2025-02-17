import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Art, Science, and Time',
  description: 'Created by Kev and the robots',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
