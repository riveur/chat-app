import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { cn } from '@/lib/utils'
import { Providers } from '@/components/providers/providers'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Chat app',
  description: 'Chat app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, 'h-[100dvh] max-h-[100dvh]')}>
        <Providers>
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  )
}
