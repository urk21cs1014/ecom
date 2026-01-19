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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await checkAuth();
  if (authError) return authError;

  try {
    const { id } = await params;
    const [materials]: any = await db.query(
      'SELECT * FROM materials WHERE id = ?',
      [id]
    );

    if (materials.length === 0) {
      return NextResponse.json(
        { error: 'Material not found' },
        { status: 404 }
      );
    }

    const material = materials[0];
    material.grades = typeof material.grades === 'string' 
      ? JSON.parse(material.grades) 
      : material.grades;

    return NextResponse.json(material);
  } catch (error) {
    console.error('GET MATERIAL ERROR:', error);
    return NextResponse.json(
      { error: 'Failed to fetch material' },
      { status: 500 }
    );
  }
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
    const { name, grades } = body;

    if (!name || !grades || !Array.isArray(grades)) {
      return NextResponse.json(
        { error: 'Name and grades (array) are required' },
        { status: 400 }
      );
    }

    await db.query(
      'UPDATE materials SET name = ?, grades = ? WHERE id = ?',
      [name, JSON.stringify(grades), id]
    );

    return NextResponse.json({
      success: true,
      message: 'Material updated successfully',
    });
  } catch (error: any) {
    console.error('UPDATE MATERIAL ERROR:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { error: 'Material with this name already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || 'Failed to update material' },
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
    await db.query('DELETE FROM materials WHERE id = ?', [id]);

    return NextResponse.json({
      success: true,
      message: 'Material deleted successfully',
    });
  } catch (error) {
    console.error('DELETE MATERIAL ERROR:', error);
    return NextResponse.json(
      { error: 'Failed to delete material' },
      { status: 500 }
    );
  }
}
