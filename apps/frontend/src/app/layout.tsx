import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body data-theme="light" suppressHydrationWarning>
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
