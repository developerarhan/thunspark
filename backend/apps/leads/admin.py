from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import Lead


@admin.register(Lead)
class LeadAdmin(ModelAdmin):
    list_display = (
        "name",
        "company",
        "email",
        "budget",
        "first_touch_source",
        "first_touch_campaign",
        "created_at",
    )
    list_filter = ("budget", "first_touch_source", "last_touch_source", "created_at")
    search_fields = ("name", "company", "email", "improvement_goal", "message")
    readonly_fields = (
        "created_at",
        "first_touch_source",
        "first_touch_medium",
        "first_touch_campaign",
        "first_touch_term",
        "first_touch_content",
        "first_referrer",
        "first_landing_page",
        "last_touch_source",
        "last_touch_medium",
        "last_touch_campaign",
        "last_referrer",
        "last_landing_page",
        "gclid",
        "fbclid",
        "msclkid",
        "raw_attribution",
        "ip_address",
        "user_agent",
    )
    fieldsets = (
        (
            "Lead Profile",
            {
                "fields": (
                    "name",
                    "email",
                    "company",
                    "website",
                    "budget",
                    "improvement_goal",
                    "message",
                    "created_at",
                )
            },
        ),
        (
            "First Touch (Acquisition Attribution)",
            {
                "fields": (
                    "first_touch_source",
                    "first_touch_medium",
                    "first_touch_campaign",
                    "first_touch_term",
                    "first_touch_content",
                    "first_referrer",
                    "first_landing_page",
                )
            },
        ),
        (
            "Last Touch (Conversion Trigger)",
            {
                "fields": (
                    "last_touch_source",
                    "last_touch_medium",
                    "last_touch_campaign",
                    "last_referrer",
                    "last_landing_page",
                )
            },
        ),
        (
            "Paid Ads Click IDs",
            {"fields": ("gclid", "fbclid", "msclkid"), "classes": ("collapse",)},
        ),
        (
            "System & Raw Payload",
            {"fields": ("ip_address", "user_agent", "raw_attribution"), "classes": ("collapse",)},
        ),
    )
