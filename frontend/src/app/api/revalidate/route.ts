import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * On-Demand ISR Cache Revalidation Route.
 * Triggered by Django signals upon content edits in Django Admin.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tag, secret } = body;

    const expectedSecret = process.env.REVALIDATE_SECRET;

    if (!expectedSecret || secret !== expectedSecret) {
      return NextResponse.json(
        { message: 'Invalid revalidation secret' },
        { status: 401 }
      );
    }

    if (!tag) {
      return NextResponse.json(
        { message: 'Cache tag parameter is required' },
        { status: 400 }
      );
    }

    (revalidateTag as any)(tag);

    return NextResponse.json({
      revalidated: true,
      tag,
      now: Date.now(),
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error processing revalidation', error: String(error) },
      { status: 500 }
    );
  }
}
