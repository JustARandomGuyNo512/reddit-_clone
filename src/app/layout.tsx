import '@/styles/globals.css'
import { Inter } from 'next/font/google'
import {cn} from '@/lib/utils'

export const metadata = {
  title: 'reddit',
  description: 'A Reddit clone built with Next.js and TypeScript.',
}

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' className={cn('bg-white text-slate-900 antialiased light')}>
      <body className='min-h-screen pt-12 bg-state-50 antialiased'>
        {/* TODO: implement Navbar component */}
        {/* <Navbar></Navbar> */}
        <div className='container mx-auto max-w-7xl h-full pt-12'>
          {children}
        </div>
      </body>
    </html>
  )
}
