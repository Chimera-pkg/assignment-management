import '@/styles/globals.css'

export const metadata = {
  title: 'Assignment Submission',
  description: 'Submit your assignment',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
