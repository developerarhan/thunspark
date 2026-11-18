const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const width = 1280;
const height = 720;

const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <linearGradient id="cardBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <linearGradient id="metaBlue" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#0064e0" />
      <stop offset="100%" stop-color="#0084ff" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#bg)" />

  <!-- Top Nav Bar -->
  <rect x="0" y="0" width="${width}" height="64" fill="#0f172a" stroke="#1e293b" stroke-width="1" />
  
  <!-- Meta Logo Icon -->
  <rect x="24" y="16" width="32" height="32" rx="8" fill="url(#metaBlue)" />
  <path d="M 32 36 C 32 28, 38 24, 40 28 C 42 24, 48 28, 48 36 C 48 32, 42 32, 40 34 C 38 32, 32 32, 32 36 Z" fill="#ffffff" />
  
  <text x="68" y="38" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="700" fill="#f8fafc">Meta Ads Manager</text>
  <text x="250" y="38" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="500" fill="#94a3b8">Account: Thunspark Scale-Up (Act_94827103)</text>

  <!-- Date Range Pill -->
  <g transform="translate(930, 16)">
    <rect width="326" height="34" rx="6" fill="#1e293b" stroke="#334155" stroke-width="1" />
    <text x="14" y="22" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="600" fill="#38bdf8">📅 Date: Oct 1, 2024 - Oct 31, 2024</text>
  </g>

  <!-- Metric KPI Cards -->
  <!-- Card 1: Amount Spent -->
  <g transform="translate(24, 84)">
    <rect width="190" height="96" rx="8" fill="url(#cardBg)" stroke="#334155" stroke-width="1" />
    <text x="16" y="28" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="600" fill="#94a3b8" letter-spacing="0.5">AMOUNT SPENT</text>
    <text x="16" y="62" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="800" fill="#f8fafc">₹54,230.50</text>
    <text x="16" y="82" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="500" fill="#22c55e">Currency: INR (₹)</text>
  </g>

  <!-- Card 2: Impressions -->
  <g transform="translate(234, 84)">
    <rect width="190" height="96" rx="8" fill="url(#cardBg)" stroke="#334155" stroke-width="1" />
    <text x="16" y="28" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="600" fill="#94a3b8" letter-spacing="0.5">IMPRESSIONS</text>
    <text x="16" y="62" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="800" fill="#f8fafc">168,450</text>
    <text x="16" y="82" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="500" fill="#38bdf8">CPM: ₹321.94</text>
  </g>

  <!-- Card 3: Link Clicks -->
  <g transform="translate(444, 84)">
    <rect width="190" height="96" rx="8" fill="url(#cardBg)" stroke="#334155" stroke-width="1" />
    <text x="16" y="28" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="600" fill="#94a3b8" letter-spacing="0.5">LINK CLICKS</text>
    <text x="16" y="62" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="800" fill="#f8fafc">4,820</text>
    <text x="16" y="82" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="500" fill="#38bdf8">CTR: 2.86%</text>
  </g>

  <!-- Card 4: Results (Conversions) -->
  <g transform="translate(654, 84)">
    <rect width="190" height="96" rx="8" fill="url(#cardBg)" stroke="#334155" stroke-width="1" />
    <text x="16" y="28" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="600" fill="#94a3b8" letter-spacing="0.5">RESULTS (LEADS)</text>
    <text x="16" y="62" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="800" fill="#38bdf8">172</text>
    <text x="16" y="82" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="500" fill="#22c55e">Conversion Rate: 3.57%</text>
  </g>

  <!-- Card 5: Cost Per Result (CPA) -->
  <g transform="translate(864, 84)">
    <rect width="190" height="96" rx="8" fill="url(#cardBg)" stroke="#334155" stroke-width="1" />
    <text x="16" y="28" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="600" fill="#94a3b8" letter-spacing="0.5">COST PER RESULT (CPA)</text>
    <text x="16" y="62" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="800" fill="#f8fafc">₹315.29</text>
    <text x="16" y="82" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="500" fill="#22c55e">-18% vs target</text>
  </g>

  <!-- Card 6: ROAS -->
  <g transform="translate(1074, 84)">
    <rect width="182" height="96" rx="8" fill="url(#cardBg)" stroke="#334155" stroke-width="1" />
    <text x="16" y="28" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="600" fill="#94a3b8" letter-spacing="0.5">PURCHASE ROAS</text>
    <text x="16" y="62" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="800" fill="#f59e0b">4.18x</text>
    <text x="16" y="82" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="500" fill="#22c55e">Total Value: ₹2,26,683</text>
  </g>

  <!-- Campaigns Table Container -->
  <g transform="translate(24, 204)">
    <rect width="1232" height="490" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1" />

    <!-- Table Header Row -->
    <rect x="0" y="0" width="1232" height="48" rx="8 8 0 0" fill="#1e293b" />
    <text x="20" y="30" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#cbd5e1">CAMPAIGN NAME</text>
    <text x="430" y="30" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#cbd5e1">DELIVERY</text>
    <text x="530" y="30" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#cbd5e1">AMOUNT SPENT</text>
    <text x="680" y="30" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#cbd5e1">IMPRESSIONS</text>
    <text x="810" y="30" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#cbd5e1">LINK CLICKS</text>
    <text x="930" y="30" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#cbd5e1">RESULTS</text>
    <text x="1040" y="30" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#cbd5e1">COST / RESULT</text>
    <text x="1145" y="30" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#cbd5e1">ROAS</text>

    <!-- Row 1 -->
    <line x1="0" y1="48" x2="1232" y2="48" stroke="#334155" stroke-width="1" />
    <rect x="0" y="49" width="1232" height="64" fill="#0f172a" />
    <!-- Toggle -->
    <circle cx="30" cy="81" r="7" fill="#22c55e" />
    <text x="48" y="86" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="600" fill="#f8fafc">Advantage+ Reels Scale - TOF Video Ad</text>
    <rect x="430" y="70" width="60" height="22" rx="4" fill="#14532d" />
    <text x="444" y="85" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="600" fill="#4ade80">Active</text>
    <text x="530" y="86" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="#f8fafc">₹28,450.00</text>
    <text x="680" y="86" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="500" fill="#cbd5e1">92,100</text>
    <text x="810" y="86" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="500" fill="#cbd5e1">2,840</text>
    <text x="930" y="86" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#38bdf8">98 Leads</text>
    <text x="1040" y="86" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="#f8fafc">₹290.31</text>
    <text x="1145" y="86" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#f59e0b">4.62</text>

    <!-- Row 2 -->
    <line x1="0" y1="113" x2="1232" y2="113" stroke="#1e293b" stroke-width="1" />
    <rect x="0" y="114" width="1232" height="64" fill="#0b1120" />
    <circle cx="30" cy="146" r="7" fill="#22c55e" />
    <text x="48" y="151" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="600" fill="#f8fafc">MOF Social Proof &amp; Testimonial Carousel</text>
    <rect x="430" y="135" width="60" height="22" rx="4" fill="#14532d" />
    <text x="444" y="150" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="600" fill="#4ade80">Active</text>
    <text x="530" y="151" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="#f8fafc">₹14,280.50</text>
    <text x="680" y="151" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="500" fill="#cbd5e1">44,250</text>
    <text x="810" y="151" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="500" fill="#cbd5e1">1,210</text>
    <text x="930" y="151" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#38bdf8">46 Leads</text>
    <text x="1040" y="151" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="#f8fafc">₹310.45</text>
    <text x="1145" y="151" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#f59e0b">3.90</text>

    <!-- Row 3 -->
    <line x1="0" y1="178" x2="1232" y2="178" stroke="#1e293b" stroke-width="1" />
    <rect x="0" y="179" width="1232" height="64" fill="#0f172a" />
    <circle cx="30" cy="211" r="7" fill="#22c55e" />
    <text x="48" y="216" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="600" fill="#f8fafc">BOF Dynamic Catalog Retargeting - DPA</text>
    <rect x="430" y="200" width="60" height="22" rx="4" fill="#14532d" />
    <text x="444" y="215" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="600" fill="#4ade80">Active</text>
    <text x="530" y="216" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="#f8fafc">₹11,500.00</text>
    <text x="680" y="216" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="500" fill="#cbd5e1">32,100</text>
    <text x="810" y="216" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="500" fill="#cbd5e1">770</text>
    <text x="930" y="216" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#38bdf8">28 Leads</text>
    <text x="1040" y="216" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="#f8fafc">₹410.71</text>
    <text x="1145" y="216" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#f59e0b">3.45</text>

    <!-- Table Total Summary Row -->
    <line x1="0" y1="243" x2="1232" y2="243" stroke="#334155" stroke-width="2" />
    <rect x="0" y="244" width="1232" height="64" fill="#1e293b" />
    <text x="48" y="282" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#f8fafc">Results from 3 campaigns (Total)</text>
    <text x="430" y="282" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="600" fill="#94a3b8">—</text>
    <text x="530" y="282" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="800" fill="#f8fafc">₹54,230.50</text>
    <text x="680" y="282" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="800" fill="#f8fafc">168,450</text>
    <text x="810" y="282" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="800" fill="#f8fafc">4,820</text>
    <text x="930" y="282" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="800" fill="#38bdf8">172 Total</text>
    <text x="1040" y="282" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="800" fill="#f8fafc">₹315.29</text>
    <text x="1145" y="282" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="800" fill="#f59e0b">4.18</text>
  </g>
</svg>
`;

async function main() {
  const outputPngPath = path.join(__dirname, '../public/test-meta-ads-screenshot.png');
  const buffer = Buffer.from(svg.trim());

  await sharp(buffer)
    .png()
    .toFile(outputPngPath);

  console.log('Successfully generated test screenshot image at:', outputPngPath);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
