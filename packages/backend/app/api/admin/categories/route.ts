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

export async function GET() {
    const authError = await checkAuth();
    if (authError) return authError;

    try {
        const [categories]: any = await db.query(`
      SELECT id, name, created_at, updated_at
      FROM categories
      ORDER BY name ASC
    `);

        return NextResponse.json({
            success: true,
            categories,
        });
    } catch (error) {
        console.error('GET CATEGORIES ERROR:', error);
        return NextResponse.json(
            { error: 'Failed to fetch categories' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    const authError = await checkAuth();
    if (authError) return authError;

    try {
        const body = await request.json();
        const { name } = body;

        if (!name) {
            return NextResponse.json(
                { error: 'Name is required' },
                { status: 400 }
            );
        }

        await db.query(
            'INSERT INTO categories (name) VALUES (?)',
            [name]
        );

        return NextResponse.json({
            success: true,
            message: 'Category created successfully',
        });
    } catch (error: any) {
        console.error('CREATE CATEGORY ERROR:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return NextResponse.json(
                { error: 'Category with this name already exists' },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: error.message || 'Failed to create category' },
            { status: 500 }
        );
    }
}
