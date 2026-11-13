# Domain Cutover & Launch Checklist

This document details the operational steps for transitioning ThunSpark from its staging deployment to the primary custom production domain (`https://www.thunspark.agency`).

---

## 1. Environment Variables to Flip (Vercel Production)

Set the following environment variables in the Vercel Dashboard under **Project Settings → Environment Variables** (Scope: **Production**):

| Variable | Staging / Pre-Cutover Value | Production Cutover Value | Purpose |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | Unset or `https://thunspark.vercel.app` | `https://www.thunspark.agency` | Feeds canonical URLs, OpenGraph, JSON-LD schemas, sitemap, and robots. |
| `NEXT_PUBLIC_ALLOW_INDEXING` | `"false"` (or unset) | `"true"` | Switches robots.txt from `Disallow: /` to `Allow: /` and enables `index, follow` across all pages. |
| `NEXT_PUBLIC_BOOKING_URL` | Optional / Test URL | `https://cal.com/thunspark/strategy` (or live Cal/scheduler URL) | Configures the single booking URL for all strategy call CTAs. |
| `UPSTASH_REDIS_REST_URL` | Optional (falls back to memory) | `https://your-db.upstash.io` | Durable distributed rate limiting & 5m dedupe storage (or KV_REST_API_URL). |
| `UPSTASH_REDIS_REST_TOKEN` | Optional | `your_upstash_rest_token` | Authentication token for Upstash Redis REST API (or KV_REST_API_TOKEN). |
| `ENQUIRY_HASH_SALT` | Optional (falls back to app salt) | `random_cryptographic_salt` | Salt for SHA-256 pseudonymous hashing of IPs and emails stored in Redis. |

> **Note**: After updating environment variables in Vercel, trigger a **Redeploy** of the production branch so the Next.js static metadata rebuilds with the new environment values.

---

## 2. DNS and SSL Configuration

Configure DNS records at your domain registrar / DNS provider (Cloudflare, Namecheap, Route 53, GoDaddy, etc.):

1. **Apex Domain (`thunspark.agency`)**:
   - **Type**: `A`
   - **Name**: `@`
   - **Value**: `76.76.21.21` (Vercel Anycast IP)
   - **TTL**: Auto or `300` (5 minutes for faster propagation)
2. **WWW Subdomain (`www.thunspark.agency`)**:
   - **Type**: `CNAME`
   - **Name**: `www`
   - **Value**: `cname.vercel-dns.com`
   - **TTL**: Auto or `300`
3. **SSL Certificate Issuance**:
   - Vercel automatically requests and renews a Let's Encrypt SSL certificate once DNS records resolve.
   - Verify under **Vercel Project Settings → Domains** that both domains show a green checkmark with valid SSL.

---

## 3. 301 Permanent Redirect Checks

Verify the following HTTP status codes using `curl -IL <url>` or a browser network inspector:

- [ ] **Legacy Redirects (`lib/redirects.ts`)**:
  - `curl -IL https://www.thunspark.agency/products`
  - *Expected*: `HTTP/2 308` or `301` redirecting to `https://www.thunspark.agency/services`.
- [ ] **Apex to WWW (or preferred canonical domain)**:
  - `curl -IL http://thunspark.agency` $\to$ redirects to `https://www.thunspark.agency`.
- [ ] **HTTP to HTTPS**:
  - `curl -IL http://www.thunspark.agency` $\to$ redirects to `https://www.thunspark.agency`.
- [ ] **Additional Legacy Paths**:
  - Add any historical URLs from the previous sitemap into `frontend/src/lib/redirects.ts` and verify their 301 status before decommissioning old infrastructure.

---

## 4. Redirect Vercel Deployment URL to Custom Domain

To prevent search engines or visitors from accessing the default `*.vercel.app` domain:

1. Open **Vercel Project Settings → Domains**.
2. Locate `thunspark.vercel.app` (or your project deployment domain).
3. Click **Edit** and set **Redirect to** `www.thunspark.agency` (Status Code: `308 Permanent Redirect`).
4. This ensures all backlinks, crawler traffic, and bookmarks permanently resolve to the primary custom domain.

---

## 5. Google Search Console Resubmission

Immediately after DNS propagation and SSL verification:

1. Open **Google Search Console** and verify domain ownership (via DNS TXT record or HTML tag).
2. Navigate to **Sitemaps** in the left menu.
3. Submit the sitemap URL: `https://www.thunspark.agency/sitemap.xml`.
4. Run URL Inspection on `https://www.thunspark.agency/` to verify:
   - Page is indexable (HTTP 200).
   - Robots meta tag allows indexing (`index, follow`).
   - Canonical URL resolves to `https://www.thunspark.agency/`.
5. Click **Request Indexing** for priority indexing of the homepage and key pillar routes (`/services`, `/projects`, `/about`).
