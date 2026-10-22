from django.db import models
from django_ckeditor_5.fields import CKEditor5Field
from apps.core.models import TimestampMixin, SEOMixin, OrderableMixin


class ServiceGroup(TimestampMixin, OrderableMixin):
    """Major service cluster: Growth Strategy, Organic Growth, Content & Creative, Web & Conversion, Paid Growth."""

    name = models.CharField(max_length=120)
    slug = models.SlugField(max_length=120, unique=True)
    icon_name = models.CharField(
        max_length=60,
        default="Compass",
        help_text="Lucide icon component name (e.g., Compass, TrendingUp, Sparkles, Layout, Target)",
    )
    summary = models.TextField(blank=True, help_text="Short description of this service domain.")
    is_active = models.BooleanField(default=True)

    class Meta(OrderableMixin.Meta):
        verbose_name = "Service Group"
        verbose_name_plural = "Service Groups"

    def __str__(self):
        return self.name


class Service(TimestampMixin, OrderableMixin, SEOMixin):
    """Specific agency service offering."""

    group = models.ForeignKey(ServiceGroup, on_delete=models.CASCADE, related_name="services")
    name = models.CharField(max_length=150)
    slug = models.SlugField(max_length=150, unique=True)
    tagline = models.CharField(max_length=255, blank=True)
    problem = models.TextField(
        help_text="The exact friction or growth barrier this service addresses."
    )
    approach = models.TextField(help_text="Our strategic methodology.")
    business_objective = models.TextField(help_text="Measurable commercial outcomes delivered.")
    process = CKEditor5Field("Process", config_name="extends", blank=True)
    deliverables = CKEditor5Field("Deliverables", config_name="extends", blank=True)
    is_active = models.BooleanField(default=True)

    class Meta(OrderableMixin.Meta):
        verbose_name = "Service"
        verbose_name_plural = "Services"

    def __str__(self):
        return f"{self.group.name} — {self.name}"


class GrowthStage(TimestampMixin, OrderableMixin):
    """The signature Discover -> Strategize -> Create -> Acquire -> Convert -> Grow interactive stages."""

    name = models.CharField(max_length=60)
    slug = models.SlugField(max_length=60, unique=True)
    step_number = models.PositiveSmallIntegerField(unique=True, help_text="Order in pipeline (1-6)")
    headline = models.CharField(max_length=150, blank=True)
    description = models.TextField(
        help_text="Clear explanation of the stage's purpose in the connected system."
    )
    icon_name = models.CharField(max_length=60, default="Search", help_text="Lucide icon name")

    class Meta(OrderableMixin.Meta):
        ordering = ["step_number"]
        verbose_name = "Growth System Stage"
        verbose_name_plural = "Growth System Stages"

    def __str__(self):
        return f"{self.step_number}. {self.name}"


class IndustryCategory(TimestampMixin, OrderableMixin):
    """Who We Help categories (E-commerce, B2B, SaaS & Tech, etc.)."""

    name = models.CharField(max_length=120)
    slug = models.SlugField(max_length=120, unique=True)
    tagline = models.CharField(max_length=200, blank=True)
    description = models.TextField(
        help_text="Focus areas, key challenges, and how we scale this category."
    )
    icon_name = models.CharField(max_length=60, default="Building", help_text="Lucide icon name")
    is_active = models.BooleanField(default=True)

    class Meta(OrderableMixin.Meta):
        verbose_name = "Industry Category"
        verbose_name_plural = "Industry Categories (Who We Help)"

    def __str__(self):
        return self.name


class Principle(TimestampMixin, OrderableMixin):
    """Why Thunspark core philosophical principles."""

    title = models.CharField(max_length=120)
    subtitle = models.CharField(max_length=200, blank=True)
    description = models.TextField()
    is_active = models.BooleanField(default=True)

    class Meta(OrderableMixin.Meta):
        verbose_name = "Principle (Why Thunspark)"
        verbose_name_plural = "Principles"

    def __str__(self):
        return self.title


class HomepageContent(TimestampMixin):
    """Editable headline, copy, and CTAs across key homepage zones."""

    SECTION_CHOICES = [
        ("hero", "Hero Section"),
        ("problem", "The Problem Section"),
        ("growth_system", "Interactive Growth System"),
        ("who_we_help", "Who We Help"),
        ("projects_preview", "Projects Section (Empty / Future)"),
        ("why_thunspark", "Why Thunspark Principles"),
        ("final_cta", "Final Conversion CTA"),
    ]
    section_key = models.CharField(max_length=50, choices=SECTION_CHOICES, unique=True)
    badge = models.CharField(max_length=80, blank=True)
    headline = models.CharField(max_length=250)
    subheadline = models.TextField(blank=True)
    cta_primary_label = models.CharField(max_length=80, blank=True)
    cta_primary_url = models.CharField(max_length=200, blank=True)
    cta_secondary_label = models.CharField(max_length=80, blank=True)
    cta_secondary_url = models.CharField(max_length=200, blank=True)
    extra_body = CKEditor5Field("Extra Content", config_name="default", blank=True)

    class Meta:
        verbose_name = "Homepage Section Copy"
        verbose_name_plural = "Homepage Sections Copy"

    def __str__(self):
        return dict(self.SECTION_CHOICES).get(self.section_key, self.section_key)


class LegalPage(TimestampMixin, SEOMixin):
    """Privacy Policy, Cookie Policy, Terms of Service."""

    PAGE_TYPE_CHOICES = [
        ("privacy", "Privacy Policy"),
        ("cookies", "Cookie Policy"),
        ("terms", "Terms of Service"),
    ]
    page_type = models.CharField(max_length=30, choices=PAGE_TYPE_CHOICES, unique=True)
    title = models.CharField(max_length=150)
    slug = models.SlugField(max_length=150, unique=True)
    last_updated = models.DateField(auto_now=True)
    content = CKEditor5Field("Legal Text", config_name="extends")

    class Meta:
        verbose_name = "Legal Page"
        verbose_name_plural = "Legal Pages"

    def __str__(self):
        return self.title
