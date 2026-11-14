import React from 'react';

export function StudioNavbar(props: any) {
  return (
    <div>
      {/* ThunSpark Persistent Agency Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          backgroundColor: '#09090b',
          borderBottom: '1px solid #27272a',
          fontSize: '12px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a
            href="/admin"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '6px',
              backgroundColor: '#18181b',
              color: '#fb923c',
              border: '1px solid #27272a',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '11px',
              transition: 'all 0.2s ease',
            }}
          >
            <span>&larr; Back to CRM Dashboard</span>
          </a>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '6px',
              backgroundColor: '#18181b',
              color: '#a1a1aa',
              border: '1px solid #27272a',
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: '11px',
            }}
          >
            <span>🌐 View Live Website</span>
          </a>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '11px',
              fontFamily: 'monospace',
              color: '#71717a',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                boxShadow: '0 0 6px #10b981',
              }}
            />
            DATASET: PRODUCTION
          </span>
        </div>
      </div>

      {/* Render Default Sanity Navbar */}
      {props.renderDefault(props)}
    </div>
  );
}
