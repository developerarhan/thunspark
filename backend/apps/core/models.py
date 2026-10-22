from django.db import models


class TimestampMixin(models.Model):
    """Adds created_at and updated_at timestamps to models."""

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class SEOMixin(models.Model):
    """Standardized SEO & OpenGraph fields across all content types."""

    meta_title = models.CharField(
        max_length=70,
        blank=True,
        help_text="Primary SEO title (max 70 chars). Falls back to main title if empty.",
    )
    meta_description = models.CharField(
        max_length=160, blank=True, help_text="Search engine snippet description (max 160 chars)."
    )
    canonical_url = models.URLField(
        blank=True, help_text="Canonical URL override. Blank will auto-generate based on slug."
    )
    og_title = models.CharField(
        max_length=70, blank=True, help_text="OpenGraph title for social media shares."
    )
    og_description = models.CharField(
        max_length=200, blank=True, help_text="OpenGraph description for social cards."
    )
    og_image = models.ImageField(
        upload_to="seo/og/", blank=True, help_text="1200x630px social card preview image."
    )
    no_index = models.BooleanField(
        default=False, help_text="Set True to instruct search bots not to index this entry."
    )

    class Meta:
        abstract = True


class OrderableMixin(models.Model):
    """Provides sort ordering control in CMS views and API outputs."""

    sort_order = models.PositiveIntegerField(
        default=0, db_index=True, help_text="Order index (lower numbers appear first)."
    )

    class Meta:
        abstract = True
        ordering = ["sort_order"]
