import { ImageResponse } from 'next/og';
import { getProjectDetailBySlug } from '@/lib/sanity/fetchers';

export const runtime = 'nodejs';

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectDetailBySlug(slug);

  const client = project?.client || 'Client Partner';
  const industry = project?.industry || 'Growth Systems';
  const year = project?.year || new Date().getFullYear();
  const headline = project?.headline || project?.summary || 'Connected Growth System & Strategic Delivery';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#050507',
          padding: '64px 72px',
          fontFamily: 'sans-serif',
          color: '#FAFAFA',
          border: '1px solid #1F2228',
          position: 'relative',
        }}
      >
        {/* Subtle radial glow */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 450,
            height: 450,
            background: 'radial-gradient(circle at top right, rgba(245, 158, 11, 0.08), transparent 70%)',
          }}
        />

        {/* Top Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          {/* Brand Wordmark with Accent Tick */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 6,
                height: 24,
                backgroundColor: '#F59E0B',
                borderRadius: 2,
              }}
            />
            <span
              style={{
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: '0.18em',
                color: '#FAFAFA',
              }}
            >
              THUNSPARK
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '6px 14px',
                borderRadius: 6,
                border: '1px solid #272A30',
                backgroundColor: '#0E1013',
                fontSize: 13,
                fontFamily: 'monospace',
                letterSpacing: '0.12em',
                color: '#F59E0B',
                textTransform: 'uppercase',
              }}
            >
              Case Study
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '6px 12px',
                borderRadius: 6,
                border: '1px solid #22252B',
                backgroundColor: '#090A0D',
                fontSize: 13,
                fontFamily: 'monospace',
                color: '#8E95A2',
              }}
            >
              {year}
            </div>
          </div>
        </div>

        {/* Main Title & Client Partner */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 1000 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <span
              style={{
                fontSize: 15,
                fontFamily: 'monospace',
                letterSpacing: '0.15em',
                color: '#F59E0B',
                textTransform: 'uppercase',
              }}
            >
              {client}
            </span>
            <span style={{ color: '#4B5563' }}>•</span>
            <span
              style={{
                fontSize: 15,
                fontFamily: 'monospace',
                letterSpacing: '0.1em',
                color: '#8E95A2',
                textTransform: 'uppercase',
              }}
            >
              {industry}
            </span>
          </div>

          <div
            style={{
              fontSize: headline.length > 60 ? 46 : 56,
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              color: '#FFFFFF',
            }}
          >
            {headline}
          </div>

          {project?.summary && (
            <div
              style={{
                fontSize: 22,
                lineHeight: 1.45,
                color: '#A1A1AA',
                marginTop: 4,
              }}
            >
              {project.summary}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            paddingTop: 24,
            borderTop: '1px solid #1A1D23',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: '#F59E0B',
              }}
            />
            <span
              style={{
                fontSize: 14,
                fontFamily: 'monospace',
                letterSpacing: '0.1em',
                color: '#8E95A2',
                textTransform: 'uppercase',
              }}
            >
              Documented Systems & Outcomes
            </span>
          </div>

          <span
            style={{
              fontSize: 14,
              fontFamily: 'monospace',
              letterSpacing: '0.05em',
              color: '#71717A',
            }}
          >
            thunspark.agency/projects
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
