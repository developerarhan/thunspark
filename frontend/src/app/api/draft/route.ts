import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

/**
 * Live Editorial Preview Route.
 * Django Admin links pass secret & slug to view unpublished drafts.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug');
  const type = searchParams.get('type') || 'blog';

  const expectedSecret = process.env.PREVIEW_SECRET;

  if (!expectedSecret || secret !== expectedSecret || !slug) {
    return new Response('Invalid preview authorization token or missing slug', {
      status: 401,
    });
  }

  const draft = await draftMode();
  draft.enable();

  if (type === 'project') {
    redirect(`/projects/${slug}`);
  }

  redirect(`/blog/${slug}`);
}
