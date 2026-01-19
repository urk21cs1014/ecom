import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      enquiry_type,        // 'GENERAL' | 'PRODUCT'
      product_name,
      product_slug,
      product_url,
      full_name,
      email,
      phone,
      company,
      quantity,
      subject,
      message,
      technical_specs,
      recaptchaToken,
    } = body;

    // reCAPTCHA Verification
    if (!recaptchaToken) {
      return NextResponse.json({ error: 'Recaptcha token missing' }, { status: 400 });
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!secretKey) {
      console.error('RECAPTCHA_SECRET_KEY is not set');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;
    const recaptchaRes = await fetch(verificationUrl, { method: 'POST' });
    const recaptchaData = await recaptchaRes.json();

    if (!recaptchaData.success || recaptchaData.score < 0.5) {
      console.warn('Recaptcha verification failed:', recaptchaData);
      return NextResponse.json({ error: 'Verification failed. Please try again.' }, { status: 400 });
    }

    if (!full_name || !email || !message || !enquiry_type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await db.query(
      `INSERT INTO enquiries (
        enquiry_type,
        product_name,
        product_slug,
        product_url,
        full_name,
        email,
        phone,
        company,
        quantity,
        subject,
        message,
        technical_specs
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        enquiry_type,
        product_name || null,
        product_slug || null,
        product_url || null,
        full_name,
        email,
        phone || null,
        company || null,
        quantity || null,
        subject || null,
        message,
        technical_specs || null,
      ]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('ENQUIRY ERROR:', error);
    return NextResponse.json(
      { error: 'Failed to send enquiry' },
      { status: 500 }
    );
  }
}