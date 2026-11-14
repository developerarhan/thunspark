import React from 'react';

export function StudioLogo(_props: any) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(234, 88, 12, 0.4)',
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span
          style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontWeight: 800,
            fontSize: '14px',
            letterSpacing: '-0.02em',
            color: '#fafafa',
          }}
        >
          THUNSPARK
        </span>
        <span
          style={{
            fontFamily: 'monospace',
            fontWeight: 700,
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            padding: '2px 6px',
            borderRadius: '4px',
            backgroundColor: 'rgba(234, 88, 12, 0.15)',
            color: '#fb923c',
            border: '1px solid rgba(234, 88, 12, 0.3)',
          }}
        >
          STUDIO
        </span>
      </div>
    </div>
  );
}
