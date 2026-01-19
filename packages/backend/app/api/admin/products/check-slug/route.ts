import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

async function checkAuth() {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }
    return null;
}

export async function POST(request: Request) {
    const authError = await checkAuth();
    if (authError) return authError;

    try {
        const { slug, excludeId } = await request.json();

        if (!slug) {
            return NextResponse.json(
                { error: 'Slug is required' },
                { status: 400 }
            );
        }

        let query = 'SELECT id FROM products WHERE slug = ?';
        const params: any[] = [slug];

        if (excludeId) {
            query += ' AND id != ?';
            params.push(excludeId);
        }

        const [rows]: any = await db.query(query, params);

        return NextResponse.json({
            exists: rows.length > 0,
            slug,
        });
    } catch (error) {
        console.error('CHECK SLUG ERROR:', error);
        return NextResponse.json(
            { error: 'Failed to check slug' },
            { status: 500 }
        );
    }
}
