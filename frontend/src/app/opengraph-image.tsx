import { ImageResponse } from 'next/og';
import { siteConfig } from '@/site.config';

export const runtime = 'nodejs';

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
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
        {/* Subtle grid background accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 400,
            height: 400,
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
            Digital Growth Agency
          </div>
        </div>

        {/* Center Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 960 }}>
          <div
            style={{
              fontSize: 14,
              fontFamily: 'monospace',
              letterSpacing: '0.2em',
              color: '#8E95A2',
              textTransform: 'uppercase',
            }}
          >
            Systems Over Slogans
          </div>
          <div
            style={{
              fontSize: 62,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: '#FFFFFF',
            }}
          >
            Strategy That Sparks Growth.
          </div>
          <div
            style={{
              fontSize: 24,
              lineHeight: 1.4,
              color: '#A1A1AA',
              marginTop: 8,
            }}
          >
            We diagnose growth bottlenecks and connect strategy, creative execution, and measurement into one compounding system.
          </div>
        </div>

        {/* Footer Row */}
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
              Strategy • Creative • Systems • Measurement
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
            thunspark.agency
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
