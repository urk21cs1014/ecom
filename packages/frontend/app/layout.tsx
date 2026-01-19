import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import TawkToChat from './components/TawkToChat';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Continental Pipes | Premium Industrial Products & Materials',
  description:
    'Browse high-quality industrial products, materials, and solutions from Continental Pipes. Shop by category or industry. Premium materials supplier for wholesale and retail.',
  keywords: 'industrial products, materials, categories, industries, wholesale supplier, continental pipes',
  metadataBase: new URL('https://yourdomain.com'),
  openGraph: {
    title: 'Continental Pipes | Premium Industrial Products & Materials',
    description: 'High-quality industrial products and materials supplier - Continental Pipes',
    url: 'https://yourdomain.com',
    siteName: 'Continental Pipes',
    type: 'website',
    images: [
      {
        url: 'https://yourdomain.com/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Continental Pipes Industrial Products',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Continental Pipes | Premium Industrial Products & Materials',
    description: 'High-quality industrial products and materials supplier - Continental Pipes',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: '/images/fav.png',
  },
};

//  MUST be separate in Next.js 16
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
      <body className="bg-white text-black min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <TawkToChat />
      </body>
    </html>
  );
}