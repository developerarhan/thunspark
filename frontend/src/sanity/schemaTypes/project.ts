import { defineType, defineField } from 'sanity';

export const projectType = defineType({
  name: 'project',
  title: 'Case Study / Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'client',
      title: 'Client Partner Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'industry',
      title: 'Industry Category',
      type: 'string',
      description: 'e.g. E-Commerce, Consumer Wellness, B2B SaaS, Logistics',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'categories',
      title: 'Portfolio Filter Categories',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Branding & Print', value: 'branding_print' },
          { title: 'Web Development', value: 'web_development' },
          { title: 'Full-Service Growth', value: 'full_service' },
          { title: 'Growth & Marketing', value: 'growth_marketing' },
        ],
      },
      description: 'Multi-category tags for the /projects overview filter tabs.',
      initialValue: ['full_service'],
    }),
    defineField({
      name: 'transformationSummary',
      title: '1-Line Transformation Summary',
      type: 'string',
      description: 'Concise summary shown on the portfolio grid card (e.g. "Replatformed direct-to-consumer store, scaling conversion rate from 1.2% to 3.8%").',
      validation: (Rule) => Rule.max(140),
    }),
    defineField({
      name: 'cover',
      title: 'Hero Cover Image / Mockup',
      type: 'image',
      description: 'Clean hero visual (e.g., laptop mockup, packaging display, or flagship screenshot) shown on grid cards and case header.',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Client Logo',
      type: 'image',
      description: 'Client partner logo for Quick Facts and tiles.',
      options: {
        hotspot: false,
      },
    }),
    defineField({
      name: 'year',
      title: 'Engagement Year',
      type: 'number',
      initialValue: 2024,
    }),
    defineField({
      name: 'featured',
      title: 'Featured On Homepage',
      type: 'boolean',
      initialValue: false,
    }),

    // ── QUICK FACTS & SCOPE DELIVERED ─────────────────────────────
    defineField({
      name: 'engagementRole',
      title: 'Global Engagement Role Notice',
      type: 'string',
      description: 'Clarifies scope boundaries prominently in Quick Facts (e.g. "Development Only — UI/UX by Client Partner" or "Full-Service Brand & Growth Sprint").',
      initialValue: 'Full-Service Agency Scope',
    }),
    defineField({
      name: 'servicesDelivered',
      title: 'Services Delivered Checklist',
      type: 'array',
      description: 'Itemized checklist of disciplines with optional scope notes.',
      of: [
        {
          type: 'object',
          name: 'serviceItem',
          title: 'Service Item',
          fields: [
            defineField({
              name: 'service',
              title: 'Discipline / Service Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'note',
              title: 'Granular Scope Note (Optional)',
              type: 'string',
              description: 'e.g. "Full-Stack Next.js 15 — UI/UX provided by partner" or "Logo, Type System & Packaging"',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'scopeTags',
      title: 'Short Scope Tags',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Compact pills for cards (e.g., Logo, Next.js, SEO, Packaging, Meta Ads).',
    }),

    // ── THE CHALLENGE & GOAL ──────────────────────────────────────
    defineField({
      name: 'challenge',
      title: 'The Challenge',
      type: 'text',
      rows: 3,
      description: '2–3 concise sentences on where the client started, the market bottleneck, or previous technical debt.',
    }),
    defineField({
      name: 'goal',
      title: 'The Strategic Goal',
      type: 'text',
      rows: 2,
      description: 'Target objective of the sprint (e.g. "Engineer a high-converting digital storefront capable of handling 50k peak daily visitors").',
    }),

    // ── PHASE 1: BRAND IDENTITY & PRINT (MODULAR) ─────────────────
    defineField({
      name: 'phaseBrand',
      title: 'Phase 1: Brand Identity & Print (Modular)',
      type: 'object',
      description: 'Rendered only if content is provided. Leave empty if ThunSpark did not handle branding.',
      fields: [
        defineField({
          name: 'enabled',
          title: 'Enable Phase 1 Section',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Brand Identity & Print Design System',
        }),
        defineField({
          name: 'description',
          title: 'Design Thesis & Execution Notes',
          type: 'text',
          rows: 3,
          description: 'Details on logo variations, color/typography alignment, product labels, and uniform graphics.',
        }),
        defineField({
          name: 'layoutStyle',
          title: 'Gallery Layout Style',
          type: 'string',
          options: {
            list: [
              { title: 'Masonry Gallery (Varied Sizes)', value: 'masonry-gallery' },
              { title: 'Logo & Identity Grid', value: 'logo-grid' },
              { title: 'Device / Packaging Showcase', value: 'device-showcase' },
              { title: 'Side-by-Side Comparison', value: 'side-by-side' },
              { title: 'Social & Asset Grid', value: 'social-grid' },
            ],
          },
          initialValue: 'masonry-gallery',
        }),
        defineField({
          name: 'images',
          title: 'Phase 1 Visual Assets (Bulk Upload)',
          type: 'array',
          description: 'Drag & drop multiple brand mockups, typography guides, uniform designs, packaging visuals, and banners.',
          of: [
            {
              type: 'object',
              name: 'brandAsset',
              title: 'Asset',
              fields: [
                defineField({
                  name: 'image',
                  title: 'Image',
                  type: 'image',
                  options: { hotspot: true },
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'alt',
                  title: 'Alt Text',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'caption',
                  title: 'Optional Caption',
                  type: 'string',
                }),
              ],
            },
          ],
        }),
        defineField({
          name: 'deliverables',
          title: 'Brand Deliverables Checklist',
          type: 'array',
          of: [{ type: 'string' }],
          description: 'e.g. Vector Logo Marks, Brand Guidelines PDF, Packaging Die-lines, Print Uniforms',
        }),
      ],
    }),

    // ── PHASE 2: DIGITAL & WEB PRESENCE (MODULAR) ─────────────────
    defineField({
      name: 'phaseDigital',
      title: 'Phase 2: Digital & Web Presence (Modular)',
      type: 'object',
      description: 'Rendered only if content is provided. Leave empty if ThunSpark did not handle web/digital engineering.',
      fields: [
        defineField({
          name: 'enabled',
          title: 'Enable Phase 2 Section',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Digital Architecture & High-Performance Web Presence',
        }),
        defineField({
          name: 'websiteUrl',
          title: 'Live Website / Application URL (Optional)',
          type: 'url',
        }),
        defineField({
          name: 'description',
          title: 'Digital Engineering Overview',
          type: 'text',
          rows: 3,
          description: 'Architecture details, speed optimizations, UX decisions, and checkout flow improvements.',
        }),
        defineField({
          name: 'techStack',
          title: 'Tech Stack Highlights',
          type: 'array',
          of: [{ type: 'string' }],
          description: 'e.g. Next.js 15, TypeScript, Tailwind CSS, PostgreSQL, Sanity CMS, Shopify Plus, Stripe',
        }),
        defineField({
          name: 'uxUiNotes',
          title: 'UX / UI Engineering Notes',
          type: 'text',
          rows: 2,
        }),
        defineField({
          name: 'layoutStyle',
          title: 'Screenshots Layout Style',
          type: 'string',
          options: {
            list: [
              { title: 'Device Showcase (Laptop / Mobile Frames)', value: 'device-showcase' },
              { title: 'Masonry Gallery (Varied Screenshots)', value: 'masonry-gallery' },
              { title: 'Side-by-Side (Desktop & Mobile)', value: 'side-by-side' },
              { title: 'Sequential Walkthrough Grid', value: 'social-grid' },
            ],
          },
          initialValue: 'device-showcase',
        }),
        defineField({
          name: 'screenshots',
          title: 'Digital & Web Screenshots (Bulk Upload)',
          type: 'array',
          description: 'Upload high-resolution website screenshots, mobile responsive views, and interactive UI component captures.',
          of: [
            {
              type: 'object',
              name: 'webScreenshot',
              title: 'Screenshot',
              fields: [
                defineField({
                  name: 'image',
                  title: 'Image',
                  type: 'image',
                  options: { hotspot: true },
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'alt',
                  title: 'Alt Text',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'caption',
                  title: 'Optional Caption',
                  type: 'string',
                }),
              ],
            },
          ],
        }),
      ],
    }),

    // ── PHASE 3: GROWTH & MARKETING (MODULAR) ────────────────────
    defineField({
      name: 'phaseGrowth',
      title: 'Phase 3: Growth & Performance Marketing (Modular)',
      type: 'object',
      description: 'Rendered only if content is provided. Leave empty if ThunSpark did not manage media or acquisition.',
      fields: [
        defineField({
          name: 'enabled',
          title: 'Enable Phase 3 Section',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Performance Marketing & Organic Growth Engine',
        }),
        defineField({
          name: 'description',
          title: 'Growth Strategy Overview',
          type: 'text',
          rows: 3,
          description: 'Overview of ad creative testing, funnel architecture, influencer seeding, and retention sequences.',
        }),
        defineField({
          name: 'channels',
          title: 'Active Growth Channels',
          type: 'array',
          of: [{ type: 'string' }],
          description: 'e.g. Meta Reels Ads, Google Search & PMax, TikTok UGC, Technical SEO, Email Klaviyo Flows',
        }),
        defineField({
          name: 'seoImprovements',
          title: 'SEO & Organic Improvements',
          type: 'text',
          rows: 2,
        }),
        defineField({
          name: 'layoutStyle',
          title: 'Asset Layout Style',
          type: 'string',
          options: {
            list: [
              { title: 'Social & Ad Grid (9:16 Reels & 1:1 Feed)', value: 'social-grid' },
              { title: 'Masonry Gallery', value: 'masonry-gallery' },
              { title: 'Side-by-Side Creatives', value: 'side-by-side' },
              { title: 'Device Showcase', value: 'device-showcase' },
            ],
          },
          initialValue: 'social-grid',
        }),
        defineField({
          name: 'creativeAssets',
          title: 'Ad Creatives & Social Assets (Bulk Upload)',
          type: 'array',
          description: 'Upload high-performing motion ad stills, carousel cards, social grid aesthetics, and marketing collateral.',
          of: [
            {
              type: 'object',
              name: 'growthAsset',
              title: 'Asset',
              fields: [
                defineField({
                  name: 'image',
                  title: 'Image',
                  type: 'image',
                  options: { hotspot: true },
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'alt',
                  title: 'Alt Text',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'caption',
                  title: 'Optional Caption',
                  type: 'string',
                }),
              ],
            },
          ],
        }),
      ],
    }),

    // ── THE RESULT & TESTIMONIAL (DUAL LAYOUT WITH GRACEFUL FALLBACK)
    defineField({
      name: 'result',
      title: 'The Result (Outcomes, Metrics & Testimonial)',
      type: 'object',
      fields: [
        defineField({
          name: 'outcomeSummary',
          title: 'Project Outcome Summary',
          type: 'text',
          rows: 3,
          description: 'Always shown as the overarching accomplishment. Serves as graceful primary content when metrics or quotes are not yet published.',
        }),
        defineField({
          name: 'keyWins',
          title: 'Key Accomplishments / Deliverables Checklist',
          type: 'array',
          of: [{ type: 'string' }],
          description: 'Bullet points of tangible wins (e.g. "Full brand & packaging rollout executed in 6 weeks", "Zero downtime during 50k visitor launch").',
        }),
        defineField({
          name: 'metrics',
          title: 'Audited KPI Metrics (Optional)',
          type: 'array',
          description: 'Quantifiable growth stats. Shown publicly ONLY when verified AND permission are true.',
          of: [
            {
              type: 'object',
              name: 'metricItem',
              title: 'Metric Item',
              fields: [
                defineField({
                  name: 'label',
                  title: 'Metric Label',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'value',
                  title: 'Metric Value',
                  type: 'string',
                  description: 'e.g. +142%, 3.8x, 48h, < 1.2s',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'verified',
                  title: 'Audited & Verified',
                  type: 'boolean',
                  initialValue: true,
                }),
                defineField({
                  name: 'permission',
                  title: 'Client Permission Granted',
                  type: 'boolean',
                  initialValue: true,
                }),
              ],
            },
          ],
        }),
        defineField({
          name: 'testimonial',
          title: 'Client Testimonial Quote (Optional)',
          type: 'object',
          description: 'Optional verified quote from the founder, CMO, or project lead.',
          fields: [
            defineField({
              name: 'quote',
              title: 'Quote Text',
              type: 'text',
              rows: 3,
            }),
            defineField({
              name: 'author',
              title: 'Author Name',
              type: 'string',
            }),
            defineField({
              name: 'title',
              title: 'Author Title / Role',
              type: 'string',
              description: 'e.g. Founder & CEO, Head of Growth',
            }),
            defineField({
              name: 'company',
              title: 'Company Name',
              type: 'string',
            }),
            defineField({
              name: 'avatar',
              title: 'Author Avatar / Photo',
              type: 'image',
              options: { hotspot: true },
            }),
          ],
        }),
      ],
    }),

    // ── LEGACY BACKWARDS-COMPATIBILITY FIELDS ──────────────────────
    defineField({
      name: 'headline',
      title: 'Case Headline (Legacy)',
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'overview',
      title: 'Executive Overview (Legacy)',
      type: 'text',
      hidden: true,
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description (Legacy)',
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'strategy',
      title: 'Strategy (Legacy)',
      type: 'text',
      hidden: true,
    }),
    defineField({
      name: 'outcomes',
      title: 'Outcomes (Legacy)',
      type: 'array',
      hidden: true,
      of: [{ type: 'object', fields: [{ name: 'label', type: 'string' }] }],
    }),
    defineField({
      name: 'scope',
      title: 'Delivered Scope Items (Legacy)',
      type: 'array',
      hidden: true,
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'servicesRendered',
      title: 'Services Rendered Tags (Legacy)',
      type: 'array',
      hidden: true,
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'honestyNote',
      title: 'Data Honesty Note',
      type: 'string',
      initialValue: 'Scope-first showcase. Detailed revenue metrics remain client-confidential.',
    }),
  ],
});
