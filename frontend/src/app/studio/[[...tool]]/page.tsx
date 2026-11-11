'use client';

import { NextStudio } from 'next-sanity/studio';
import sanityConfig from '../../../../sanity.config';

export const dynamic = 'force-static';

export default function StudioPage() {
  return (
    <div className="pt-20">
      <NextStudio config={sanityConfig} />
    </div>
  );
}
