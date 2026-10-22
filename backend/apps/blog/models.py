from django.db import models
from django.contrib.auth import get_user_model
from django.utils.html import strip_tags
from django_ckeditor_5.fields import CKEditor5Field
from apps.core.models import TimestampMixin, SEOMixin

User = get_user_model()


class Category(TimestampMixin):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


class Tag(models.Model):
    name = models.CharField(max_length=60)
    slug = models.SlugField(max_length=60, unique=True)

    def __str__(self):
        return self.name


class Author(TimestampMixin):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=150)
    slug = models.SlugField(max_length=150, unique=True)
    role = models.CharField(max_length=120, default="Growth Strategist")
    bio = models.TextField(blank=True)
    avatar = models.ImageField(upload_to="authors/", blank=True)
    linkedin_url = models.URLField(blank=True)

    def __str__(self):
        return self.name


class Article(TimestampMixin, SEOMixin):
    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("published", "Published"),
        ("scheduled", "Scheduled"),
    ]

    title = models.CharField(max_length=250)
    slug = models.SlugField(max_length=250, unique=True)
    excerpt = models.CharField(
        max_length=320, help_text="Concise lead synopsis for index cards and meta descriptions."
    )
    content = CKEditor5Field("Content", config_name="extends")
    featured_image = models.ImageField(upload_to="blog/featured/")
    featured_image_alt = models.CharField(max_length=200, blank=True)

    author = models.ForeignKey(
        Author, on_delete=models.SET_NULL, null=True, related_name="articles"
    )
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, related_name="articles"
    )
    tags = models.ManyToManyField(Tag, blank=True, related_name="articles")

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")
    is_featured = models.BooleanField(default=False)
    published_at = models.DateTimeField(null=True, blank=True)
    scheduled_at = models.DateTimeField(null=True, blank=True)

    reading_time = models.PositiveIntegerField(
        default=3, help_text="Estimated minutes to read. Auto-calculated upon save."
    )
    views_count = models.PositiveIntegerField(default=0)
    faq_schema = models.JSONField(
        default=list,
        blank=True,
        help_text='Optional structured schema. Example: [{"question": "...", "answer": "..."}]',
    )

    class Meta:
        ordering = ["-published_at", "-created_at"]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if self.content:
            plain_words = len(strip_tags(self.content).split())
            self.reading_time = max(1, round(plain_words / 200))
        super().save(*args, **kwargs)
