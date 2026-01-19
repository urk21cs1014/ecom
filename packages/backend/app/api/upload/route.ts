import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
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
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file uploaded' },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const originalName = file.name.replace(/[^a-zA-Z0-9.]/g, '-');
        const filename = `${uniqueSuffix}-${originalName}`;

        // Ensure upload directory exists
        const uploadDir = join(process.cwd(), 'public', 'uploads', 'admin');
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            // Ignore error if directory exists
        }

        // Write file
        const filepath = join(uploadDir, filename);
        await writeFile(filepath, buffer);

        // Return public URL
        const url = `/uploads/admin/${filename}`;

        return NextResponse.json({
            success: true,
            url,
        });
    } catch (error) {
        console.error('UPLOAD ERROR:', error);
        return NextResponse.json(
            { error: 'Failed to upload file' },
            { status: 500 }
        );
    }
}
