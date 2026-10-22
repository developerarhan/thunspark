from django.contrib import admin
from unfold.admin import ModelAdmin, TabularInline
from .models import Project, ProjectGalleryImage


class ProjectGalleryImageInline(TabularInline):
    model = ProjectGalleryImage
    extra = 1


@admin.register(Project)
class ProjectAdmin(ModelAdmin):
    list_display = (
        "title",
        "client_name",
        "industry",
        "is_featured",
        "is_published",
        "published_at",
    )
    list_filter = ("is_featured", "is_published", "industry", "services")
    list_editable = ("is_featured", "is_published")
    prepopulated_fields = {"slug": ("title",)}
    search_fields = ("title", "client_name", "short_description")
    filter_horizontal = ("services",)
    inlines = [ProjectGalleryImageInline]
    fieldsets = (
        (
            None,
            {
                "fields": (
                    "title",
                    "slug",
                    "client_name",
                    "industry",
                    "services",
                    "thumbnail",
                    "short_description",
                    "is_featured",
                    "is_published",
                    "published_at",
                )
            },
        ),
        (
            "Strategic Case Study",
            {
                "fields": (
                    "overview",
                    "challenge",
                    "objective",
                    "strategy",
                    "execution",
                    "results",
                    "key_learnings",
                ),
                "classes": ("collapse",),
            },
        ),
        (
            "Authentic Client Testimonial",
            {
                "fields": ("testimonial_quote", "testimonial_author", "testimonial_role"),
                "classes": ("collapse",),
            },
        ),
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
