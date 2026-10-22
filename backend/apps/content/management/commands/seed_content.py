from django.core.management.base import BaseCommand
from django.db import transaction
from apps.content.models import (
    ServiceGroup,
    Service,
    GrowthStage,
    IndustryCategory,
    Principle,
    HomepageContent,
    LegalPage,
)
from apps.analytics.models import TrackingConfig


class Command(BaseCommand):
    help = (
        "Seeds initial Thunspark agency content according to technical specification (Idempotent)."
    )

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Seeding Thunspark agency system data..."))

        # 1. Growth System (The Signature 6-Stage Pipeline)
        stages_data = [
            (
                1,
                "Discover",
                "discover",
                "Search",
                "Understand customers, market, competitors, search behavior, and the existing digital presence.",
            ),
            (
                2,
                "Strategize",
                "strategize",
                "Compass",
                "Turn research into positioning, messaging, channel strategy, and measurable objectives.",
            ),
            (
                3,
                "Create",
                "create",
                "Sparkles",
                "Build content, websites, landing pages, campaigns, and high-impact creative assets.",
            ),
            (
                4,
                "Acquire",
                "acquire",
                "Target",
                "Deploy search, content, social, Pinterest, paid media, and relevant acquisition channels.",
            ),
            (
                5,
                "Convert",
                "convert",
                "TrendingUp",
                "Turn qualified attention and traffic into enquiries, high-value pipeline, and revenue.",
            ),
            (
                6,
                "Grow",
                "grow",
                "Activity",
                "Measure performance, systematically identify bottlenecks, and compound efficiency.",
            ),
        ]
        for step, name, slug, icon, desc in stages_data:
            GrowthStage.objects.update_or_create(
                slug=slug,
                defaults={
                    "name": name,
                    "step_number": step,
                    "headline": f"{name.upper()} — Strategic Phase",
                    "description": desc,
                    "icon_name": icon,
                },
            )
        self.stdout.write(self.style.SUCCESS("[OK] Growth stages seeded."))

        # 2. Service Groups & Core Offerings
        groups_data = [
            (
                "Growth Strategy",
                "growth-strategy",
                "Compass",
                "Start with the business problem. Build the strategic foundation before touching tactical channels.",
                [
                    (
                        "Digital Strategy",
                        "digital-strategy",
                        "Comprehensive digital audits, channel mapping, and tactical roadmaps.",
                        "Businesses waste budget executing disjointed campaigns without overarching business goals.",
                        "Full audit of market positioning, digital touchpoints, unit economics, and customer lifecycles.",
                        "A multi-quarter roadmap aligning acquisition, conversion, and retention.",
                    ),
                    (
                        "Marketing Strategy",
                        "marketing-strategy",
                        "End-to-end commercial alignment across marketing operations.",
                        "Disorganized marketing teams chasing vanity metrics without revenue impact.",
                        "Unifying product marketing, sales enablement, and channel prioritization.",
                        "Predictable customer acquisition engines built on sound unit economics.",
                    ),
                    (
                        "Positioning & Messaging",
                        "positioning",
                        "Stand out in crowded markets with indisputable differentiation.",
                        "Looking and sounding like every other competitor in your niche.",
                        "Customer interview synthesis, value proposition redesign, and messaging playbooks.",
                        "Clear market authority and higher conversion rates on every channel.",
                    ),
                    (
                        "Growth Planning",
                        "growth-planning",
                        "Systematic forecasting, resource allocation, and scaling benchmarks.",
                        "Scaling spend into untested channels resulting in diminishing returns.",
                        "Data-backed scenario modeling, budget allocation, and payback period tracking.",
                        "Disciplined scale without operational breakdown.",
                    ),
                ],
            ),
            (
                "Organic Growth",
                "organic-growth",
                "TrendingUp",
                "Compound organic visibility that reduces reliance on rising ad costs.",
                [
                    (
                        "Search Engine Optimization (SEO)",
                        "seo",
                        "Technical, architectural, and intent-driven organic dominance.",
                        "Ranking for high-volume keywords that bring zero qualified sales enquiries.",
                        "Deep search intent modeling, technical health remediation, and programmatic content architecture.",
                        "Defensible top-of-funnel customer flow that compounds month over month.",
                    ),
                    (
                        "Content Marketing",
                        "content-marketing",
                        "Authority-building content that solves real buyer friction.",
                        "Publishing generic articles that no qualified decision-maker reads.",
                        "Editorial roadmaps addressing specific commercial objections and comparison searches.",
                        "Articles that rank, educate, and drive demo or sales calls.",
                    ),
                    (
                        "Pinterest Marketing",
                        "pinterest-marketing",
                        "Visual search and long-tail evergreen acquisition.",
                        "Underutilizing visual search engines for ecommerce and lifestyle intent.",
                        "Visual optimization, rich pins, keyword boards, and evergreen funnel hooks.",
                        "Multi-month compounding referral traffic with extended half-life.",
                    ),
                    (
                        "Organic Social Media",
                        "organic-social",
                        "Positioning executive teams and brands as category leaders.",
                        "Posting daily graphics without audience resonance or business objectives.",
                        "Point-of-view driven commentary, case documentation, and community cultivation.",
                        "Direct buyer engagement and organic referral momentum.",
                    ),
                ],
            ),
            (
                "Content & Creative",
                "content-creative",
                "Sparkles",
                "High-converting visual and editorial assets that command attention.",
                [
                    (
                        "Content Strategy",
                        "content-strategy",
                        "The strategic blueprint guiding all narrative production.",
                        "Creative assets produced in silos without conversion objectives.",
                        "Narrative pillars, content-market fit validation, and distribution blueprints.",
                        "Content efficiency where each piece serves multiple acquisition touchpoints.",
                    ),
                    (
                        "Social Content Production",
                        "social-content",
                        "Engaging short-form, carousels, and high-retention formats.",
                        "Low engagement rates and forgettable brand impressions.",
                        "Platform-native storytelling, micro-case studies, and visual breakdowns.",
                        "High retention, shares, and qualified inbound inquiries.",
                    ),
                    (
                        "Strategic Copywriting",
                        "copywriting",
                        "Words that clarify value, resolve doubts, and provoke decisions.",
                        "Vague, corporate jargon that loses prospect interest within seconds.",
                        "Direct-response psychology applied to landing pages, ads, and email sequences.",
                        "Measurable uplift in click-through and form conversion rates.",
                    ),
                ],
            ),
            (
                "Web & Conversion",
                "web-conversion",
                "Layout",
                "Fast, bespoke digital experiences engineered to turn traffic into revenue.",
                [
                    (
                        "Website Design",
                        "website-design",
                        "Modern dark aesthetics, editorial typography, and intuitive UX.",
                        "Outdated templates that degrade brand perception and trust.",
                        "Bespoke wireframes, interactive design systems, and rapid prototyping.",
                        "A digital presence that reflects market-leading authority.",
                    ),
                    (
                        "Website Development",
                        "website-development",
                        "Blazing-fast Next.js engineering with headless CMS control.",
                        "Slow WordPress sites riddled with plugin vulnerabilities and high bounce rates.",
                        "Full-stack Next.js + Django engineering, Core Web Vitals optimization, and clean architecture.",
                        "Sub-second load times and frictionless content editing.",
                    ),
                    (
                        "Conversion Rate Optimization (CRO)",
                        "cro",
                        "Systematic testing to extract more value from every visitor.",
                        "Pouring ad dollars into funnels that leak 97% of qualified traffic.",
                        "Session analytics, heatmaps, friction audits, and iterative A/B testing.",
                        "Higher customer volume without increasing acquisition spend.",
                    ),
                    (
                        "Landing Pages",
                        "landing-pages",
                        "High-velocity campaign pages built for specific ad intent.",
                        "Sending paid ad traffic to generic homepages with low relevance.",
                        "Single-purpose conversion architectures tightly matched to ad hooks.",
                        "Maximized ROAS and lowered cost per acquisition.",
                    ),
                ],
            ),
            (
                "Paid Growth",
                "paid-growth",
                "Target",
                "Capital-efficient paid acquisition across search and social intent.",
                [
                    (
                        "Google Ads (Search & Performance Max)",
                        "google-ads",
                        "Capture active buyers at peak commercial intent.",
                        "Burning budget on broad match terms and unqualified clicks.",
                        "Negative keyword matrices, high-intent landing page pairings, and server-side tracking.",
                        "Consistent, predictable high-intent pipeline.",
                    ),
                    (
                        "Meta Ads (Facebook & Instagram)",
                        "meta-ads",
                        "Targeted customer acquisition through creative-led testing.",
                        "Rising CPMs and creative fatigue exhausting audience pools.",
                        "Dynamic creative testing frameworks, angle diversification, and retargeting systems.",
                        "Scalable acquisition with healthy return on ad spend (ROAS).",
                    ),
                    (
                        "Retargeting & Lifecycle Ads",
                        "retargeting",
                        "Re-engage interested prospects across the consideration window.",
                        "Ignoring the 95% of buyers who don't purchase on their first visit.",
                        "Segmented remarketing sequences based on behavioral depth and time elapsed.",
                        "Higher lifetime value and minimized lead drop-off.",
                    ),
                ],
            ),
        ]

        for order, (g_name, g_slug, g_icon, g_sum, services) in enumerate(groups_data, start=1):
            group, _ = ServiceGroup.objects.update_or_create(
                slug=g_slug,
                defaults={
                    "name": g_name,
                    "icon_name": g_icon,
                    "summary": g_sum,
                    "sort_order": order,
                    "is_active": True,
                },
            )
            for s_order, (s_name, s_slug, s_tagline, s_prob, s_appr, s_obj) in enumerate(
                services, start=1
            ):
                Service.objects.update_or_create(
                    slug=s_slug,
                    defaults={
                        "group": group,
                        "name": s_name,
                        "tagline": s_tagline,
                        "problem": s_prob,
                        "approach": s_appr,
                        "business_objective": s_obj,
                        "sort_order": s_order,
                        "is_active": True,
                        "meta_title": f"{s_name} | Thunspark Strategic Growth",
                        "meta_description": s_tagline[:160],
                    },
                )
        self.stdout.write(self.style.SUCCESS("[OK] Service groups and services seeded."))

        # 3. Who We Help (Industry Categories)
        industries_data = [
            (
                "E-commerce & DTC",
                "ecommerce",
                "ShoppingBag",
                "Scale revenue and customer lifetime value through connected search, paid acquisition, and conversion testing.",
                1,
            ),
            (
                "B2B & Professional Services",
                "b2b",
                "Briefcase",
                "Position firm authority, drive high-intent inquiries, and shorten multi-touch enterprise sales cycles.",
                2,
            ),
            (
                "SaaS & Technology",
                "saas-technology",
                "Cpu",
                "Turn product features into compelling value narratives that lower customer acquisition costs and drive product demos.",
                3,
            ),
            (
                "High-Ticket Services",
                "high-ticket-services",
                "Gem",
                "Engineered conversion funnels tailored to selective clients requiring deep credibility and proof of expertise.",
                4,
            ),
            (
                "Consumer Brands",
                "consumer-brands",
                "Users",
                "Build distinct visual identity, brand affinity, and multi-channel customer retention systems.",
                5,
            ),
        ]
        for name, slug, icon, desc, order in industries_data:
            IndustryCategory.objects.update_or_create(
                slug=slug,
                defaults={
                    "name": name,
                    "icon_name": icon,
                    "description": desc,
                    "sort_order": order,
                    "is_active": True,
                },
            )
        self.stdout.write(self.style.SUCCESS("[OK] Industry categories seeded."))

        # 4. Principles (Why Thunspark)
        principles_data = [
            (
                "Problem First",
                "Start with the business problem, not a predefined service.",
                "We don't sell tools, tactics, or bloated retainer packages for the sake of it. We diagnose where your growth is bottlenecked, then engineer the exact solution required.",
                1,
            ),
            (
                "Strategy Before Execution",
                "Choose channels and tactics only after understanding the commercial objective.",
                "Tactics without strategic positioning burn capital fast. Every piece of creative, code, and ad spend is rooted in validated buyer behavior.",
                2,
            ),
            (
                "Connected Systems",
                "Strategy, content, acquisition, website, and conversion must work as one engine.",
                "Marketing breaks down when channels operate in isolated silos. We unify messaging across every touchpoint to eliminate conversion leakage.",
                3,
            ),
            (
                "Measure What Matters",
                "Focus on revenue and qualified pipeline rather than vanity metrics.",
                "Impressions and clicks don't pay salaries. We optimize toward customer acquisition cost, conversion rate, and tangible commercial return.",
                4,
            ),
            (
                "Built To Evolve",
                "Systems designed to continuously adapt as markets and technologies shift.",
                "Digital environments are never static. We build modular, resilient architectures that compound efficiency over time rather than requiring constant rebuilds.",
                5,
            ),
        ]
        for title, subtitle, desc, order in principles_data:
            Principle.objects.update_or_create(
                title=title,
                defaults={
                    "subtitle": subtitle,
                    "description": desc,
                    "sort_order": order,
                    "is_active": True,
                },
            )
        self.stdout.write(self.style.SUCCESS("[OK] Principles seeded."))

        # 5. Homepage Content Copy
        homepage_sections = [
            (
                "hero",
                "Strategic Digital Growth Agency",
                "Digital Marketing Built Around Your Growth.",
                "We help ambitious businesses turn strategy, content, search, websites, and digital channels into a connected system designed to attract, convert, and grow customers.",
                "Start a Conversation",
                "/contact",
                "Explore Services",
                "/services",
            ),
            (
                "problem",
                "The Core Bottleneck",
                "More Marketing Isn't Always the Answer.",
                "Most businesses suffer from content without strategy, traffic without conversions, websites without clear positioning, social channels with no business objective, and advertising without a strong conversion path.",
                "Explore Our Approach",
                "/about",
                "",
                "",
            ),
            (
                "projects_preview",
                "Portfolio Pipeline",
                "Building What Comes Next.",
                "We're building this portfolio one ambitious project at a time. As we work with businesses around the world, this space will become a collection of the strategies, systems, and outcomes we create.",
                "Work With Us",
                "/contact",
                "",
                "",
            ),
            (
                "final_cta",
                "Take The Next Step",
                "Have a Growth Problem Worth Solving?",
                "Tell us what's not working. We'll start with the problem, not a sales pitch.",
                "Start a Conversation",
                "/contact",
                "View Services",
                "/services",
            ),
        ]
        for key, badge, headline, sub, cta1, url1, cta2, url2 in homepage_sections:
            HomepageContent.objects.update_or_create(
                section_key=key,
                defaults={
                    "badge": badge,
                    "headline": headline,
                    "subheadline": sub,
                    "cta_primary_label": cta1,
                    "cta_primary_url": url1,
                    "cta_secondary_label": cta2,
                    "cta_secondary_url": url2,
                },
            )
        self.stdout.write(self.style.SUCCESS("[OK] Homepage content seeded."))

        # 6. Legal Pages (Placeholders)
        legal_pages = [
            (
                "privacy",
                "Privacy Policy",
                "privacy-policy",
                "<h2>Privacy Policy</h2><p><em>[This is a legal template — consult a certified legal professional before commercial launch.]</em></p><p>Thunspark respects your privacy and is committed to protecting your personal data. This privacy notice explains how we look after your personal data when you visit our website.</p>",
            ),
            (
                "cookies",
                "Cookie Policy",
                "cookie-policy",
                "<h2>Cookie Policy</h2><p><em>[This is a legal template — consult a certified legal professional before commercial launch.]</em></p><p>We use cookies to improve your browsing experience, provide analytics, and measure campaign performance in accordance with GDPR and applicable regulations.</p>",
            ),
            (
                "terms",
                "Terms of Service",
                "terms-of-service",
                "<h2>Terms of Service</h2><p><em>[This is a legal template — consult a certified legal professional before commercial launch.]</em></p><p>By accessing or using the services provided by Thunspark, you agree to be bound by these Terms of Service.</p>",
            ),
        ]
        for p_type, title, slug, content in legal_pages:
            LegalPage.objects.update_or_create(
                page_type=p_type,
                defaults={
                    "title": title,
                    "slug": slug,
                    "content": content,
                    "meta_title": f"{title} | Thunspark",
                    "meta_description": f"Official {title} for Thunspark Digital Growth Agency.",
                },
            )
        self.stdout.write(self.style.SUCCESS("[OK] Legal pages seeded."))

        # 7. Default Analytics Integrations
        TrackingConfig.objects.get_or_create(
            platform="gtm",
            defaults={
                "tracking_id": "GTM-THUNSPARK",
                "is_enabled": False,
                "required_consent": "necessary",
            },
        )
        self.stdout.write(self.style.SUCCESS("[OK] Analytics config registered."))
        self.stdout.write(self.style.SUCCESS("All initial seed data successfully loaded!"))
