from django.db import models
from apps.core.models import TimestampMixin


class Lead(TimestampMixin):
    BUDGET_CHOICES = [
        ("under_1k", "Under $1,000"),
        ("1k_3k", "$1,000–$3,000"),
        ("3k_5k", "$3,000–$5,000"),
        ("5k_10k", "$5,000–$10,000"),
        ("10k_plus", "$10,000+"),
    ]

    # Contact Details
    name = models.CharField(max_length=200)
    email = models.EmailField(db_index=True)
    company = models.CharField(max_length=200, blank=True)
    website = models.URLField(blank=True)
    improvement_goal = models.TextField(
        blank=True, help_text="What are you trying to improve (bottleneck/challenge)?"
    )
    budget = models.CharField(max_length=30, choices=BUDGET_CHOICES, blank=True)
    message = models.TextField(blank=True)

    # Attribution: First-Touch (Acquisition Source)
    first_touch_source = models.CharField(max_length=150, blank=True, db_index=True)
    first_touch_medium = models.CharField(max_length=150, blank=True, db_index=True)
    first_touch_campaign = models.CharField(max_length=255, blank=True)
    first_touch_term = models.CharField(max_length=255, blank=True)
    first_touch_content = models.CharField(max_length=255, blank=True)
    first_referrer = models.URLField(max_length=500, blank=True)
    first_landing_page = models.CharField(max_length=500, blank=True)

    # Attribution: Last-Touch (Conversion Trigger)
    last_touch_source = models.CharField(max_length=150, blank=True, db_index=True)
    last_touch_medium = models.CharField(max_length=150, blank=True, db_index=True)
    last_touch_campaign = models.CharField(max_length=255, blank=True)
    last_referrer = models.URLField(max_length=500, blank=True)
    last_landing_page = models.CharField(max_length=500, blank=True)

    # Ad Platform Click IDs
    gclid = models.CharField(max_length=255, blank=True, help_text="Google Ads Click ID")
    fbclid = models.CharField(max_length=255, blank=True, help_text="Meta Pixel Click ID")
    msclkid = models.CharField(max_length=255, blank=True, help_text="Microsoft Ads Click ID")

    # Complete Raw Attribution Snapshot
    raw_attribution = models.JSONField(default=dict, blank=True)

    # Security & System Metadata
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True)

    # Future CRM Sync
    crm_synced = models.BooleanField(default=False)
    crm_id = models.CharField(max_length=255, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} ({self.company or self.email}) - {self.budget or 'No budget'}"
