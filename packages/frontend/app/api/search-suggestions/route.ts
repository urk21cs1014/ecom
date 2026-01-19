import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 1) {
        return NextResponse.json({ suggestions: [] });
    }

    try {
        const [rows]: any = await db.query(
            `SELECT title, slug, image1_url, category FROM products 
       WHERE title LIKE ? OR category LIKE ?
       LIMIT 5`,
            [`%${query}%`, `%${query}%`]
        );

        return NextResponse.json({ suggestions: rows });
    } catch (error) {
        console.error('Search suggestion error:', error);
        return NextResponse.json({ suggestions: [] }, { status: 500 });
    }
}
