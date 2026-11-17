import React from 'react';

export function StudioLogo(_props: any) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <img
        src="/brand/logo.jpg"
        alt="ThunSpark Logo"
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '8px',
          objectFit: 'cover',
          border: '1px solid rgba(255, 210, 31, 0.4)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
        }}
      />
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
          THUN<span style={{ color: '#FFD21F' }}>SPARK</span>
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
            backgroundColor: 'rgba(255, 210, 31, 0.15)',
            color: '#FFD21F',
            border: '1px solid rgba(255, 210, 31, 0.3)',
          }}
        >
          STUDIO
        </span>
      </div>
    </div>
  );
}
