import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Backend',
  description: 'Backend admin panel',
  robots: {
    index: false,
    follow: false,
  },
};

// ✅ MUST be separate in Next.js 16
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  );
}