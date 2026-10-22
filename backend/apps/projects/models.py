from django.db import models
from django_ckeditor_5.fields import CKEditor5Field
from apps.core.models import TimestampMixin, SEOMixin
from apps.content.models import ServiceGroup, IndustryCategory


class Project(TimestampMixin, SEOMixin):
    """Case study/project. Note: Initial state is intentionally empty until real client work is created."""

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    client_name = models.CharField(max_length=200, blank=True)
    industry = models.ForeignKey(
        IndustryCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name="projects"
    )
    services = models.ManyToManyField(ServiceGroup, blank=True, related_name="projects")
    thumbnail = models.ImageField(upload_to="projects/thumbnails/")
    short_description = models.TextField(help_text="Concise summary for project preview cards.")

    # Narrative Breakdown (Only rendered in Next.js if populated)
    overview = CKEditor5Field("Overview", config_name="extends", blank=True)
    challenge = CKEditor5Field("Challenge", config_name="extends", blank=True)
    objective = CKEditor5Field("Objective", config_name="extends", blank=True)
    strategy = CKEditor5Field("Strategy", config_name="extends", blank=True)
    execution = CKEditor5Field("Execution", config_name="extends", blank=True)
    results = CKEditor5Field("Results", config_name="extends", blank=True)
    key_learnings = CKEditor5Field("Key Learnings", config_name="extends", blank=True)

    # Authentic Testimonial
    testimonial_quote = models.TextField(blank=True)
    testimonial_author = models.CharField(max_length=150, blank=True)
    testimonial_role = models.CharField(max_length=150, blank=True)

    is_featured = models.BooleanField(default=False)
    is_published = models.BooleanField(default=False)
    published_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-is_featured", "-published_at", "-created_at"]
        verbose_name = "Project"
        verbose_name_plural = "Projects"

    def __str__(self):
        return self.title


class ProjectGalleryImage(TimestampMixin):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="gallery")
    image = models.ImageField(upload_to="projects/gallery/")
    caption = models.CharField(max_length=200, blank=True)
    alt_text = models.CharField(max_length=200)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order"]
