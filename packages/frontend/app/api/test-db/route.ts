import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await db.query('SELECT DATABASE() AS db');
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('DB ERROR:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}