from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import Article, Category, Tag, Author


@admin.register(Category)
class CategoryAdmin(ModelAdmin):
    list_display = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Tag)
class TagAdmin(ModelAdmin):
    list_display = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Author)
class AuthorAdmin(ModelAdmin):
    list_display = ("name", "role", "slug")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Article)
class ArticleAdmin(ModelAdmin):
    list_display = (
        "title",
        "category",
        "author",
        "status",
        "is_featured",
        "published_at",
        "reading_time",
    )
    list_filter = ("status", "is_featured", "category", "tags")
    list_editable = ("status", "is_featured")
    prepopulated_fields = {"slug": ("title",)}
    search_fields = ("title", "excerpt", "content")
    filter_horizontal = ("tags",)
    fieldsets = (
        (
            None,
            {
                "fields": (
                    "title",
                    "slug",
                    "excerpt",
                    "author",
                    "category",
                    "tags",
                    "featured_image",
                    "featured_image_alt",
                    "status",
                    "is_featured",
                    "published_at",
                    "scheduled_at",
                )
            },
        ),
        ("Full Content", {"fields": ("content",)}),
        (
            "Structured Engine & FAQ",
            {"fields": ("reading_time", "views_count", "faq_schema"), "classes": ("collapse",)},
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
