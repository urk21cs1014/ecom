'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function TawkToChat() {
    const pathname = usePathname();

    useEffect(() => {
        // Check if environment variables are present
        const propertyId = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID;
        const widgetId = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID;

        if (!propertyId || !widgetId) {
            console.warn('Tawk.to property ID or widget ID is missing in environment variables.');
            return;
        }

        // Tawk.to Script
        const s1 = document.createElement("script");
        const s0 = document.getElementsByTagName("script")[0];
        s1.async = true;
        s1.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
        s1.charset = 'UTF-8';
        s1.setAttribute('crossorigin', '*');

        if (s0 && s0.parentNode) {
            s0.parentNode.insertBefore(s1, s0);
        } else {
            document.head.appendChild(s1);
        }

        return () => {
            // Cleanup if necessary, though Tawk.to is usually persistent.
            // Tawk.to doesn't provide a comprehensive cleanup method for the script tag itself easily without potential side effects, 
            // but this effect generally runs once on mount if we don't depend on pathname.
            // If we want to re-initialize on route change (SPA behavior), Tawk.to handles it mostly automatically.
        };
    }, []); // Run once on mount

    // Optional: Update Tawk API on route change if needed
    useEffect(() => {
        // @ts-ignore
        if (window.Tawk_API && window.Tawk_API.onLoaded) {
            // @ts-ignore
            // window.Tawk_API.minimize(); // Start minimized?
        }
    }, [pathname]);


    return null; // This component does not render any visual UI directly
}
