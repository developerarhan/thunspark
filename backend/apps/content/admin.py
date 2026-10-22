from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import (
    ServiceGroup,
    Service,
    GrowthStage,
    IndustryCategory,
    Principle,
    HomepageContent,
    LegalPage,
)


@admin.register(ServiceGroup)
class ServiceGroupAdmin(ModelAdmin):
    list_display = ("name", "slug", "icon_name", "sort_order", "is_active")
    list_editable = ("sort_order", "is_active")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name", "summary")


@admin.register(Service)
class ServiceAdmin(ModelAdmin):
    list_display = ("name", "group", "slug", "sort_order", "is_active")
    list_filter = ("group", "is_active")
    list_editable = ("sort_order", "is_active")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name", "tagline", "problem", "approach")
    fieldsets = (
        (None, {"fields": ("group", "name", "slug", "tagline", "is_active", "sort_order")}),
        ("Strategic Foundation", {"fields": ("problem", "approach", "business_objective")}),
        ("Detailed Scope", {"fields": ("process", "deliverables")}),
        (
            "SEO & Metadata",
            {
                "fields": (
                    "meta_title",
                    "meta_description",
                    "canonical_url",
                    "og_title",
                    "og_description",
                    "og_image",
                    "no_index",
                ),
                "classes": ("collapse",),
            },
        ),
    )


@admin.register(GrowthStage)
class GrowthStageAdmin(ModelAdmin):
    list_display = ("step_number", "name", "slug", "headline", "icon_name")
    list_display_links = ("name",)
    list_editable = ("step_number",)
    prepopulated_fields = {"slug": ("name",)}


@admin.register(IndustryCategory)
class IndustryCategoryAdmin(ModelAdmin):
    list_display = ("name", "slug", "icon_name", "sort_order", "is_active")
    list_editable = ("sort_order", "is_active")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Principle)
class PrincipleAdmin(ModelAdmin):
    list_display = ("title", "subtitle", "sort_order", "is_active")
    list_editable = ("sort_order", "is_active")


@admin.register(HomepageContent)
class HomepageContentAdmin(ModelAdmin):
    list_display = ("section_key", "headline", "cta_primary_label")


@admin.register(LegalPage)
class LegalPageAdmin(ModelAdmin):
    list_display = ("title", "page_type", "slug", "last_updated")
    prepopulated_fields = {"slug": ("title",)}
