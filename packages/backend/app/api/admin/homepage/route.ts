import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        const [items]: any = await db.query('SELECT * FROM homepage_items ORDER BY section_key, sort_order');
        return NextResponse.json({ success: true, items });
    } catch (error) {
        console.error('Error fetching homepage items:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { sectionKey, itemIds } = await req.json();

        if (!sectionKey || !Array.isArray(itemIds)) {
            return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });
        }

        // Use a transaction for safety
        await db.query('START TRANSACTION');

        // Delete existing items for this section
        await db.query('DELETE FROM homepage_items WHERE section_key = ?', [sectionKey]);

        // Insert new items
        if (itemIds.length > 0) {
            const values = itemIds.map((id, index) => [sectionKey, id, index]);
            await db.query('INSERT INTO homepage_items (section_key, item_id, sort_order) VALUES ?', [values]);
        }

        await db.query('COMMIT');

        return NextResponse.json({ success: true, message: 'Configuration updated' });
    } catch (error) {
        await db.query('ROLLBACK');
        console.error('Error updating homepage items:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
