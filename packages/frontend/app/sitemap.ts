import { notFound } from 'next/navigation';
import { MetadataRoute } from 'next';
import { db } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const isProduction = process.env.NODE_ENV === 'production';
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://continentalpipes.com';

    // In Development, return 404
    if (!isProduction) {
        notFound();
    }

    // Static routes
    const routes = [
        '',
        '/shop',
        '/materials',
        '/offers',
        '/about-us',
        '/contact-us',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic Products
    const [products]: any = await db.query('SELECT slug, updated_at FROM products WHERE status = 1');
    const productUrls = products.map((product: any) => ({
        url: `${baseUrl}/products/${product.slug}`,
        lastModified: new Date(product.updated_at || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    // Dynamic Materials
    const [materials]: any = await db.query('SELECT slug, updated_at FROM materials');
    const materialUrls = materials.map((material: any) => ({
        url: `${baseUrl}/materials/${material.slug}`,
        lastModified: new Date(material.updated_at || new Date()),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    return [...routes, ...productUrls, ...materialUrls];
}
