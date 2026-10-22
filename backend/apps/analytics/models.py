from django.db import models
from apps.core.models import TimestampMixin


class TrackingConfig(TimestampMixin):
    """Centralized tracking IDs configured in Django Admin."""

    PLATFORM_CHOICES = [
        ("gtm", "Google Tag Manager (Container ID)"),
        ("ga4", "Google Analytics 4 (Measurement ID)"),
        ("google_ads", "Google Ads (Conversion ID)"),
        ("meta_pixel", "Meta Pixel (Pixel ID)"),
        ("linkedin", "LinkedIn Insight Tag (Partner ID)"),
        ("pinterest", "Pinterest Tag (Tag ID)"),
    ]

    CONSENT_CHOICES = [
        ("necessary", "Strictly Necessary (Always loaded)"),
        ("analytics", "Performance & Analytics Category"),
        ("marketing", "Targeting & Marketing Category"),
    ]

    platform = models.CharField(max_length=40, choices=PLATFORM_CHOICES, unique=True)
    tracking_id = models.CharField(max_length=120, help_text="e.g. GTM-XXXXXX, G-XXXXXX, etc.")
    is_enabled = models.BooleanField(default=False)
    required_consent = models.CharField(max_length=30, choices=CONSENT_CHOICES, default="marketing")

    class Meta:
        verbose_name = "Tracking Integration"
        verbose_name_plural = "Tracking Integrations"

    def __str__(self):
        return f"{self.get_platform_display()}: {self.tracking_id} ({'Active' if self.is_enabled else 'Disabled'})"
