'use client';

import React, { useState, useEffect, useRef, useTransition } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  Image as ImageIcon,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  TrendingUp,
  Calendar,
  X,
  Edit3,
  ExternalLink,
} from 'lucide-react';
import { saveAdPerformanceReportAction } from '@/app/(admin)/admin/actions-phase2';

export interface SavedReportItem {
  id: string;
  platform: string;
  dateStart: string | null;
  dateEnd: string | null;
  currency: string;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  cpa: number;
  roas: number | null;
  aiSummaryNotes: string | null;
  sourceType: string;
  fileName: string | null;
  createdAt: string;
}

interface ClientAdPerformanceTabProps {
  clientId: string;
  clientName: string;
  currency: string;
  initialReports: SavedReportItem[];
}

interface ExtractedData {
  platform: 'meta' | 'google' | 'other';
  date_start: string | null;
  date_end: string | null;
  currency: string;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  cpa: number;
  roas: number | null;
  ai_summary_notes: string;
}

export function ClientAdPerformanceTab({
  clientId,
  clientName,
  currency: clientCurrency,
  initialReports,
}: ClientAdPerformanceTabProps) {
  const [reports, setReports] = useState<SavedReportItem[]>(initialReports);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verification stage
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [sourceType, setSourceType] = useState<'screenshot' | 'csv' | 'manual'>('screenshot');
  const [fileName, setFileName] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);

  const [isSaving, startSavingTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Total Client Spend & Performance
  const totalSpend = reports.reduce((acc, r) => acc + (r.spend || 0), 0);
  const totalConversions = reports.reduce((acc, r) => acc + (r.conversions || 0), 0);
  const avgCpa =
    totalConversions > 0
      ? (totalSpend / totalConversions).toFixed(2)
      : reports.length > 0
        ? (reports.reduce((acc, r) => acc + (r.cpa || 0), 0) / reports.length).toFixed(2)
        : '0.00';
  const roasReports = reports.filter((r) => r.roas !== null && r.roas !== undefined);
  const avgRoas =
    roasReports.length > 0
      ? (roasReports.reduce((acc, r) => acc + (r.roas || 0), 0) / roasReports.length).toFixed(2)
      : '—';

  // Global paste handler for screenshots (Ctrl+V / Cmd+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!e.clipboardData) return;
      const items = e.clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            handleFileUpload(blob);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [clientId]);

  const handleFileUpload = async (file: File) => {
    setError(null);
    setIsAnalyzing(true);
    setFileName(file.name);

    // If image, create local object URL for instant preview comparison
    if (file.type.startsWith('image/')) {
      setSourceType('screenshot');
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
    } else {
      setSourceType('csv');
      setPreviewImage(null);
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('clientId', clientId);

      const res = await fetch('/api/parse-ad-report', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || `Failed to analyze report (${res.status})`);
      }

      if (json.data) {
        setExtractedData(json.data);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleManualEntry = () => {
    setError(null);
    setPreviewImage(null);
    setSourceType('manual');
    setFileName('manual-entry');
    setExtractedData({
      platform: 'meta',
      date_start: new Date().toISOString().slice(0, 10),
      date_end: new Date().toISOString().slice(0, 10),
      currency: clientCurrency || 'INR',
      spend: 0,
      impressions: 0,
      clicks: 0,
      conversions: 0,
      cpa: 0,
      roas: 0,
      ai_summary_notes: 'Manually logged performance report by media buyer.',
    });
  };

  const handleFieldChange = (key: keyof ExtractedData, value: any) => {
    if (!extractedData) return;
    setExtractedData({
      ...extractedData,
      [key]: value,
    });
  };

  const handleConfirmSave = () => {
    if (!extractedData) return;

    startSavingTransition(async () => {
      const res = await saveAdPerformanceReportAction({
        clientId,
        platform: extractedData.platform,
        dateStart: extractedData.date_start,
        dateEnd: extractedData.date_end,
        currency: extractedData.currency || clientCurrency || 'INR',
        spend: Number(extractedData.spend) || 0,
        impressions: Number(extractedData.impressions) || 0,
        clicks: Number(extractedData.clicks) || 0,
        conversions: Number(extractedData.conversions) || 0,
        cpa: Number(extractedData.cpa) || 0,
        roas: extractedData.roas !== null ? Number(extractedData.roas) : null,
        aiSummaryNotes: extractedData.ai_summary_notes,
        sourceType,
        fileName,
      });

      if (res?.success) {
        // Optimistic UI update
        const newReport: SavedReportItem = {
          id: res.reportId || `rep-${Date.now()}`,
          platform: extractedData.platform,
          dateStart: extractedData.date_start,
          dateEnd: extractedData.date_end,
          currency: extractedData.currency || clientCurrency || 'INR',
          spend: Number(extractedData.spend) || 0,
          impressions: Number(extractedData.impressions) || 0,
          clicks: Number(extractedData.clicks) || 0,
          conversions: Number(extractedData.conversions) || 0,
          cpa: Number(extractedData.cpa) || 0,
          roas: extractedData.roas !== null ? Number(extractedData.roas) : null,
          aiSummaryNotes: extractedData.ai_summary_notes,
          sourceType,
          fileName,
          createdAt: new Date().toISOString(),
        };

        setReports((prev) => [newReport, ...prev]);
        setExtractedData(null);
        setPreviewImage(null);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Overview KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-elevated border border-line/60">
          <span className="text-[10px] font-mono uppercase text-meta block">Total Tracked Spend</span>
          <div className="text-xl font-bold font-display text-ink mt-1">
            {clientCurrency} {totalSpend.toLocaleString()}
          </div>
          <span className="text-[10px] text-meta font-mono mt-0.5 block">{reports.length} Verified Reports</span>
        </div>

        <div className="p-4 rounded-xl bg-elevated border border-line/60">
          <span className="text-[10px] font-mono uppercase text-meta block">Total Conversions / Leads</span>
          <div className="text-xl font-bold font-display text-accent mt-1">
            {totalConversions.toLocaleString()}
          </div>
          <span className="text-[10px] text-meta font-mono mt-0.5 block">Primary Results</span>
        </div>

        <div className="p-4 rounded-xl bg-elevated border border-line/60">
          <span className="text-[10px] font-mono uppercase text-meta block">Blended CPA</span>
          <div className="text-xl font-bold font-display text-emerald-400 mt-1">
            {clientCurrency} {avgCpa}
          </div>
          <span className="text-[10px] text-meta font-mono mt-0.5 block">Cost Per Acquisition</span>
        </div>

        <div className="p-4 rounded-xl bg-elevated border border-line/60">
          <span className="text-[10px] font-mono uppercase text-meta block">Blended ROAS</span>
          <div className="text-xl font-bold font-display text-emerald-400 mt-1">
            {avgRoas}{avgRoas !== '—' ? 'x' : ''}
          </div>
          <span className="text-[10px] text-meta font-mono mt-0.5 block">Return on Ad Spend</span>
        </div>
      </div>

      {/* ── DROP-ZONE CONTAINER ── */}
      {!extractedData && !isAnalyzing && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleFileUpload(e.dataTransfer.files[0]);
            }
          }}
          className={`relative rounded-2xl border-2 border-dashed p-8 sm:p-10 text-center transition-all cursor-pointer ${
            isDragging
              ? 'border-accent bg-accent/10'
              : 'border-line hover:border-accent/50 bg-card/40 hover:bg-card/70'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />

          <div className="max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mx-auto">
              <UploadCloud size={24} />
            </div>

            <div>
              <h3 className="text-sm font-display font-bold text-ink">
                AI Vision &amp; File Drop-Zone for {clientName}
              </h3>
              <p className="text-xs text-soft mt-1 leading-relaxed">
                Drag &amp; drop a Meta Ads / Google Ads <strong className="text-ink">screenshot (.png, .jpg)</strong> or <strong className="text-ink">CSV export</strong>, or paste with <kbd className="px-1.5 py-0.5 rounded bg-elevated border border-line font-mono text-[10px]">Ctrl+V</kbd>.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-meta">
                <ImageIcon size={13} className="text-indigo-400" />
                <span>Dashboard Screenshots</span>
              </span>
              <span className="text-line">•</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-meta">
                <FileSpreadsheet size={13} className="text-emerald-400" />
                <span>Raw CSV Reports</span>
              </span>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleManualEntry();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-elevated hover:bg-line border border-line text-[11px] font-mono text-soft hover:text-ink transition-colors"
              >
                <Edit3 size={12} />
                <span>Enter Manually</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── AI ANALYZING STATE ── */}
      {isAnalyzing && (
        <div className="rounded-2xl border border-accent/30 bg-accent/5 p-8 text-center space-y-3 animate-pulse">
          <div className="w-12 h-12 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent mx-auto">
            <RefreshCw size={24} className="animate-spin" />
          </div>
          <h3 className="text-sm font-display font-bold text-ink">
            Analyzing Report with Gemini 2.5 Flash...
          </h3>
          <p className="text-xs text-soft max-w-sm mx-auto font-mono">
            Multimodal OCR vision model is extracting spend, impressions, clicks, CPA, and ROAS.
          </p>
        </div>
      )}

      {/* ── ERROR MESSAGE ── */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle size={15} className="shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-soft hover:text-ink font-mono text-[10px]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ── HUMAN-IN-THE-LOOP VERIFICATION PREVIEW CARD ── */}
      {extractedData && (
        <div className="bg-card border-2 border-accent/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl relative">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-accent text-canvas">
                <Sparkles size={16} />
              </span>
              <div>
                <h3 className="text-sm font-display font-bold text-ink">
                  AI Extraction Verification &amp; Preview
                </h3>
                <span className="text-[10px] font-mono text-meta">
                  Source: {sourceType.toUpperCase()} {fileName ? `(${fileName})` : ''} • Review before saving to CRM
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setExtractedData(null);
                setPreviewImage(null);
              }}
              className="p-1 rounded-lg hover:bg-elevated text-soft hover:text-ink transition-colors"
              title="Discard"
            >
              <X size={16} />
            </button>
          </div>

          {/* AI Observation & Anomaly Badge */}
          {extractedData.ai_summary_notes && (
            <div className="p-3.5 rounded-xl bg-accent/10 border border-accent/30 text-xs text-ink flex items-start gap-2.5">
              <Sparkles size={14} className="text-accent shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-accent font-mono text-[11px] uppercase block mb-0.5">
                  AI Executive Insight &amp; Anomaly Flag
                </span>
                <p className="text-soft leading-relaxed">{extractedData.ai_summary_notes}</p>
              </div>
            </div>
          )}

          {/* Side-by-Side: Image Thumbnail vs Editable Data Form */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left: Thumbnail Preview (if screenshot) */}
            {previewImage && (
              <div className="md:col-span-5 space-y-2">
                <span className="text-[10px] font-mono uppercase text-meta block">
                  Original Dashboard Screenshot
                </span>
                <div className="rounded-xl overflow-hidden border border-line bg-base max-h-[360px] overflow-y-auto">
                  <img
                    src={previewImage}
                    alt="Uploaded Dashboard Preview"
                    className="w-full object-contain"
                  />
                </div>
              </div>
            )}

            {/* Right: Editable Form Inputs */}
            <div className={previewImage ? 'md:col-span-7 space-y-4' : 'md:col-span-12 space-y-4'}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-mono uppercase text-[10px] text-meta mb-1">Platform</label>
                  <select
                    value={extractedData.platform}
                    onChange={(e) => handleFieldChange('platform', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-elevated border border-line text-ink font-semibold"
                  >
                    <option value="meta">Meta Ads (FB/Insta)</option>
                    <option value="google">Google Ads</option>
                    <option value="other">Other Channel</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono uppercase text-[10px] text-meta mb-1">Currency</label>
                  <input
                    type="text"
                    value={extractedData.currency}
                    onChange={(e) => handleFieldChange('currency', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-elevated border border-line text-ink font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase text-[10px] text-meta mb-1">Date Range</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="date"
                      value={extractedData.date_start || ''}
                      onChange={(e) => handleFieldChange('date_start', e.target.value)}
                      className="w-1/2 px-2 py-1.5 rounded-lg bg-elevated border border-line text-ink text-[11px] font-mono"
                    />
                    <span className="text-meta">-</span>
                    <input
                      type="date"
                      value={extractedData.date_end || ''}
                      onChange={(e) => handleFieldChange('date_end', e.target.value)}
                      className="w-1/2 px-2 py-1.5 rounded-lg bg-elevated border border-line text-ink text-[11px] font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-mono uppercase text-[10px] text-meta mb-1">Amount Spent</label>
                  <input
                    type="number"
                    step="0.01"
                    value={extractedData.spend}
                    onChange={(e) => handleFieldChange('spend', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-elevated border border-line text-accent font-bold font-mono"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase text-[10px] text-meta mb-1">Conversions / Leads</label>
                  <input
                    type="number"
                    value={extractedData.conversions}
                    onChange={(e) => handleFieldChange('conversions', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-elevated border border-line text-ink font-bold font-mono"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase text-[10px] text-meta mb-1">CPA (Cost/Action)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={extractedData.cpa}
                    onChange={(e) => handleFieldChange('cpa', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-elevated border border-line text-emerald-400 font-bold font-mono"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase text-[10px] text-meta mb-1">ROAS (Multiplier)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={extractedData.roas ?? ''}
                    placeholder="e.g. 4.2"
                    onChange={(e) => handleFieldChange('roas', e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-3 py-2 rounded-xl bg-elevated border border-line text-emerald-400 font-bold font-mono"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase text-[10px] text-meta mb-1">Impressions</label>
                  <input
                    type="number"
                    value={extractedData.impressions}
                    onChange={(e) => handleFieldChange('impressions', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-elevated border border-line text-ink font-mono"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase text-[10px] text-meta mb-1">Clicks</label>
                  <input
                    type="number"
                    value={extractedData.clicks}
                    onChange={(e) => handleFieldChange('clicks', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-elevated border border-line text-ink font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono uppercase text-[10px] text-meta mb-1">
                  AI Notes &amp; Observations
                </label>
                <textarea
                  rows={2}
                  value={extractedData.ai_summary_notes}
                  onChange={(e) => handleFieldChange('ai_summary_notes', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-elevated border border-line text-ink text-xs"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-line flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setExtractedData(null);
                    setPreviewImage(null);
                  }}
                  className="px-4 py-2 rounded-xl hover:bg-elevated text-xs text-soft font-mono"
                >
                  Discard
                </button>
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={handleConfirmSave}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-accent text-canvas font-bold text-xs hover:bg-accent-hi transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  <CheckCircle2 size={14} />
                  <span>{isSaving ? 'Saving to Database...' : 'Save Report to CRM'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── HISTORICAL AD PERFORMANCE REPORTS ── */}
      <div className="bg-card border border-line rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-line flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-accent" />
            <h3 className="text-sm font-display font-semibold text-ink">
              Ad Performance Reports Log ({reports.length})
            </h3>
          </div>
        </div>

        {reports.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <p className="text-xs text-soft font-mono">
              No performance reports uploaded for {clientName} yet.
            </p>
            <p className="text-[11px] text-meta">
              Drop your first Meta or Google Ads screenshot above to start tracking.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-elevated border-b border-line text-meta font-mono uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Date / Window</th>
                  <th className="py-3 px-4">Platform</th>
                  <th className="py-3 px-4">Spend</th>
                  <th className="py-3 px-4">Conversions</th>
                  <th className="py-3 px-4">CPA</th>
                  <th className="py-3 px-4">ROAS</th>
                  <th className="py-3 px-4">AI Observations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {reports.map((rep) => {
                  const isMeta = rep.platform === 'meta';
                  const dateStr =
                    rep.dateStart && rep.dateEnd
                      ? `${new Date(rep.dateStart).toLocaleDateString()} - ${new Date(rep.dateEnd).toLocaleDateString()}`
                      : new Date(rep.createdAt).toLocaleDateString();

                  return (
                    <tr key={rep.id} className="hover:bg-elevated/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <div className="text-ink font-semibold">{dateStr}</div>
                        <span className="text-[9px] text-meta uppercase">via {rep.sourceType}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono border font-semibold ${
                            isMeta
                              ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                              : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          }`}
                        >
                          {isMeta ? 'Meta Ads' : rep.platform === 'google' ? 'Google Ads' : 'Other'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-accent">
                        {rep.currency} {Number(rep.spend).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-ink">
                        {rep.conversions}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                        {rep.currency} {Number(rep.cpa).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                        {rep.roas ? `${rep.roas}x` : '—'}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs text-soft text-[11px] leading-relaxed">
                        {rep.aiSummaryNotes || '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
