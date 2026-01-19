'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Breadcrumb() {
  const pathname = usePathname();

  // ❌ Do not show on home
  if (pathname === '/') return null;

  const segments = pathname.split('/').filter(Boolean);

  let path = '';

  return (
    <div className="ext-gray-600 border-b border-text-gray-600">
      <div className="max-w-7xl mx-auto px-6 py-3 text-sm text-gray-600">
        <nav className="flex items-center gap-2 flex-wrap">

          {/* Home */}
          <Link href="/" className="hover:text-orange-600 font-medium">
            Home
          </Link>

          {segments.map((segment, index) => {
            path += `/${segment}`;
            const isLast = index === segments.length - 1;

            const label = decodeURIComponent(segment)
              .replace(/-/g, ' ')
              .replace(/_/g, ' ')
              .replace(/\b\w/g, c => c.toUpperCase());

            return (
              <span key={path} className="flex items-center gap-2">
                <span className="text-gray-400">/</span>

                {isLast ? (
                  <span className="text-black font-bold">
                    {label}
                  </span>
                ) : (
                  <Link
                    href={path}
                    className="hover:text-orange-600"
                  >
                    {label}
                  </Link>
                )}
              </span>
            );
          })}
        </nav>
      </div>
    </div>
  );
}