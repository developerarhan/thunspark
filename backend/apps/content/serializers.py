from rest_framework import serializers
from .models import (
    ServiceGroup,
    Service,
    GrowthStage,
    IndustryCategory,
    Principle,
    HomepageContent,
    LegalPage,
)


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = [
            "id",
            "name",
            "slug",
            "tagline",
            "problem",
            "approach",
            "business_objective",
            "process",
            "deliverables",
            "sort_order",
            "meta_title",
            "meta_description",
            "canonical_url",
            "og_title",
            "og_description",
            "og_image",
            "no_index",
        ]


class ServiceGroupSerializer(serializers.ModelSerializer):
    services = ServiceSerializer(many=True, read_only=True)

    class Meta:
        model = ServiceGroup
        fields = ["id", "name", "slug", "icon_name", "summary", "sort_order", "services"]


class GrowthStageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GrowthStage
        fields = ["id", "name", "slug", "step_number", "headline", "description", "icon_name"]


class IndustryCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = IndustryCategory
        fields = ["id", "name", "slug", "tagline", "description", "icon_name", "sort_order"]


class PrincipleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Principle
        fields = ["id", "title", "subtitle", "description", "sort_order"]


class HomepageContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomepageContent
        fields = [
            "section_key",
            "badge",
            "headline",
            "subheadline",
            "cta_primary_label",
            "cta_primary_url",
            "cta_secondary_label",
            "cta_secondary_url",
            "extra_body",
        ]


class LegalPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = LegalPage
        fields = [
            "page_type",
            "title",
            "slug",
            "last_updated",
            "content",
            "meta_title",
            "meta_description",
            "canonical_url",
            "og_image",
        ]
