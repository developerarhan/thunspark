from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import TrackingConfig


@admin.register(TrackingConfig)
class TrackingConfigAdmin(ModelAdmin):
    list_display = ("platform", "tracking_id", "is_enabled", "required_consent", "updated_at")
    list_editable = ("is_enabled", "required_consent")
    list_filter = ("platform", "is_enabled", "required_consent")
