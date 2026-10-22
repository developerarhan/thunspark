from rest_framework import serializers
from .models import Project, ProjectGalleryImage
from apps.content.serializers import ServiceGroupSerializer, IndustryCategorySerializer


class ProjectGalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectGalleryImage
        fields = ["id", "image", "caption", "alt_text", "sort_order"]


class ProjectListSerializer(serializers.ModelSerializer):
    industry = IndustryCategorySerializer(read_only=True)
    services = ServiceGroupSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = [
            "id",
            "title",
            "slug",
            "client_name",
            "industry",
            "services",
            "thumbnail",
            "short_description",
            "is_featured",
            "published_at",
        ]


class ProjectDetailSerializer(serializers.ModelSerializer):
    industry = IndustryCategorySerializer(read_only=True)
    services = ServiceGroupSerializer(many=True, read_only=True)
    gallery = ProjectGalleryImageSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = [
            "id",
            "title",
            "slug",
            "client_name",
            "industry",
            "services",
            "thumbnail",
            "short_description",
            "overview",
            "challenge",
            "objective",
            "strategy",
            "execution",
            "results",
            "key_learnings",
            "testimonial_quote",
            "testimonial_author",
            "testimonial_role",
            "gallery",
            "is_featured",
            "published_at",
            "meta_title",
            "meta_description",
            "canonical_url",
            "og_title",
            "og_description",
            "og_image",
            "no_index",
        ]
