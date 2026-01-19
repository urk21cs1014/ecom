import { NextResponse } from 'next/server';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    const response = NextResponse.json(
      { success: true, message: 'Login successful' },
      { status: 200 }
    );

    const ONE_DAY_IN_SECONDS = 60 * 60 * 24;

    response.cookies.set('admin_token', 'authenticated', {
      httpOnly: true,
      secure: false, // Set to false to allow login over HTTP (Not Secure)
      sameSite: 'lax',
      path: '/',
      maxAge: ONE_DAY_IN_SECONDS,
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}

