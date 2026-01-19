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
    const [materials]: any = await db.query(`
      SELECT id, name, grades, created_at, updated_at
      FROM materials
      ORDER BY name ASC
    `);

    // Parse JSON grades
    const materialsWithParsedGrades = materials.map((material: any) => ({
      ...material,
      grades: typeof material.grades === 'string' 
        ? JSON.parse(material.grades) 
        : material.grades,
    }));

    return NextResponse.json({
      success: true,
      materials: materialsWithParsedGrades,
    });
  } catch (error) {
    console.error('GET MATERIALS ERROR:', error);
    return NextResponse.json(
      { error: 'Failed to fetch materials' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const authError = await checkAuth();
  if (authError) return authError;

  try {
    const body = await request.json();
    const { name, grades } = body;

    if (!name || !grades || !Array.isArray(grades)) {
      return NextResponse.json(
        { error: 'Name and grades (array) are required' },
        { status: 400 }
      );
    }

    await db.query(
      'INSERT INTO materials (name, grades) VALUES (?, ?)',
      [name, JSON.stringify(grades)]
    );

    return NextResponse.json({
      success: true,
      message: 'Material created successfully',
    });
  } catch (error: any) {
    console.error('CREATE MATERIAL ERROR:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { error: 'Material with this name already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || 'Failed to create material' },
      { status: 500 }
    );
  }
}
