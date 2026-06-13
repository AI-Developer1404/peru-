import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cinematic Concierge — Premium Digital Guidebook',
  description:
    'A white-label digital guidebook and AI concierge for luxury boutique hotels. Elevate your guest experience with immersive maps, audio guides, and intelligent assistance.',
  keywords: ['hotel', 'concierge', 'digital guidebook', 'luxury', 'boutique hotel', 'AI assistant'],
  authors: [{ name: 'Cinematic Concierge' }],
  openGraph: {
    title: 'Cinematic Concierge',
    description: 'Premium digital guidebook for luxury boutique hotels.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0a0a0f',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
