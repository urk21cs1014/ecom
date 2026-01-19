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

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const authError = await checkAuth();
    if (authError) return authError;

    try {
        const { id } = await params;
        const body = await request.json();
        const { name } = body;

        if (!name) {
            return NextResponse.json(
                { error: 'Name is required' },
                { status: 400 }
            );
        }

        await db.query(
            'UPDATE categories SET name = ? WHERE id = ?',
            [name, id]
        );

        return NextResponse.json({
            success: true,
            message: 'Category updated successfully',
        });
    } catch (error: any) {
        console.error('UPDATE CATEGORY ERROR:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return NextResponse.json(
                { error: 'Category with this name already exists' },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: error.message || 'Failed to update category' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const authError = await checkAuth();
    if (authError) return authError;

    try {
        const { id } = await params;

        // Check if category is used by any products
        const [products]: any = await db.query(
            'SELECT id FROM products WHERE category_id = ? LIMIT 1',
            [id]
        );

        if (products.length > 0) {
            return NextResponse.json(
                { error: 'Cannot delete category because it is being used by products' },
                { status: 400 }
            );
        }

        await db.query('DELETE FROM categories WHERE id = ?', [id]);

        return NextResponse.json({
            success: true,
            message: 'Category deleted successfully',
        });
    } catch (error: any) {
        console.error('DELETE CATEGORY ERROR:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to delete category' },
            { status: 500 }
        );
    }
}
