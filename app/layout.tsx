import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const title = "Zielonogórska mapa mobilnych puszek WOŚP"
const description = "Zobacz gdzie znaleźć wolontariuszy WOŚP w Zielonej Górze!"

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_DOMAIN || 'https://wosp.mopsior.pl'),
    title: title,
    description: description,
    openGraph: {
        title: title,
        type: 'website',
        description: description,
        url: process.env.NEXT_PUBLIC_DOMAIN,
        siteName: title,
    },
    twitter: {
        site: process.env.NEXT_PUBLIC_DOMAIN,
        title: title,
        description: description,
        card: 'summary_large_image'
    }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className="h-full m-0">
      <body
        className="antialiased h-full m-0"
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
