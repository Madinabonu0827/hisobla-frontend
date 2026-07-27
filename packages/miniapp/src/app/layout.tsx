import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0a0a1a',
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'Hisob Bot',
  description: 'Moliyaviy yordamchi',
  other: {
    'telegram-webapp-ready': '1',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" className="dark">
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-[#0a0a1a] h-[100dvh] overflow-hidden">
        <main className="max-w-lg mx-auto h-full relative flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
