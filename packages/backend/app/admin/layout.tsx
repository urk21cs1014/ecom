import '../globals.css';
import AdminLayoutWrapper from './components/AdminLayoutWrapper';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard | E-Commerce Backend',
  description: 'Admin panel for managing products and enquiries',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
      </body>
    </html>
  );
}
