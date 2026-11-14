'use client';

import React, { useState } from 'react';
import type { SanityDocument } from 'sanity';

interface IframePreviewProps {
  document: {
    displayed: SanityDocument;
  };
  options?: {
    url?: string | ((doc: SanityDocument) => string | null);
  };
}

export function IframePreview(props: IframePreviewProps) {
  const { document: doc, options } = props;
  const displayed = doc?.displayed;

  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [reloadKey, setReloadKey] = useState(0);

  // Determine URL
  let targetUrl: string | null = null;
  if (typeof options?.url === 'function') {
    targetUrl = options.url(displayed);
  } else if (typeof options?.url === 'string') {
    targetUrl = options.url;
  } else {
    // Fallback heuristic based on schema type
    const slug = (displayed?.slug as any)?.current;
    if (slug) {
      if (displayed._type === 'post') targetUrl = `/blog/${slug}`;
      else if (displayed._type === 'project') targetUrl = `/projects/${slug}`;
      else targetUrl = `/${slug}`;
    }
  }

  const deviceWidths = {
    mobile: '375px',
    tablet: '768px',
    desktop: '100%',
  };

  const handleReload = () => {
    setReloadKey((prev) => prev + 1);
  };

  if (!targetUrl) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          backgroundColor: '#09090b',
          color: '#71717a',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: '24px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: '#18181b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px',
            color: '#fb923c',
            border: '1px solid #27272a',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        </div>
        <p style={{ fontWeight: 600, color: '#fafafa', margin: '0 0 6px 0', fontSize: '14px' }}>
          Document Slug Required
        </p>
        <p style={{ fontSize: '12px', maxWidth: '320px', lineHeight: 1.5, margin: 0 }}>
          Generate or enter a valid URL slug in the form editor to activate real-time page preview.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#09090b',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Device Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          backgroundColor: '#0f0f12',
          borderBottom: '1px solid #27272a',
          fontSize: '12px',
        }}
      >
        {/* Device Switcher */}
        <div
          style={{
            display: 'inline-flex',
            backgroundColor: '#18181b',
            borderRadius: '8px',
            padding: '2px',
            border: '1px solid #27272a',
          }}
        >
          {(['mobile', 'tablet', 'desktop'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setDevice(mode)}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: device === mode ? '#ea580c' : 'transparent',
                color: device === mode ? '#ffffff' : '#a1a1aa',
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'capitalize',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Target URL & External Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '11px',
              color: '#71717a',
              backgroundColor: '#18181b',
              padding: '3px 8px',
              borderRadius: '4px',
              border: '1px solid #27272a',
              maxWidth: '260px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {targetUrl}
          </span>

          <button
            onClick={handleReload}
            title="Reload Preview Frame"
            style={{
              padding: '4px 8px',
              backgroundColor: '#18181b',
              color: '#fafafa',
              border: '1px solid #27272a',
              borderRadius: '6px',
              fontSize: '11px',
              cursor: 'pointer',
            }}
          >
            ↻ Reload
          </button>

          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open in new window"
            style={{
              padding: '4px 8px',
              backgroundColor: '#18181b',
              color: '#fb923c',
              border: '1px solid #27272a',
              borderRadius: '6px',
              fontSize: '11px',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            Open ↗
          </a>
        </div>
      </div>

      {/* Frame Container */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'stretch',
          backgroundColor: '#09090b',
          overflow: 'hidden',
          padding: device === 'desktop' ? '0' : '16px',
        }}
      >
        <iframe
          key={reloadKey}
          src={targetUrl}
          title="Sanity Live Document Preview"
          style={{
            width: deviceWidths[device],
            height: '100%',
            border: device === 'desktop' ? 'none' : '1px solid #27272a',
            borderRadius: device === 'desktop' ? '0' : '12px',
            backgroundColor: '#0a0a0a',
            boxShadow: device === 'desktop' ? 'none' : '0 20px 40px rgba(0,0,0,0.8)',
            transition: 'width 0.25s ease',
          }}
        />
      </div>
    </div>
  );
}
