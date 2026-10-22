from rest_framework import viewsets, permissions
from .models import (
    ServiceGroup,
    Service,
    GrowthStage,
    IndustryCategory,
    Principle,
    HomepageContent,
    LegalPage,
)
from .serializers import (
    ServiceGroupSerializer,
    ServiceSerializer,
    GrowthStageSerializer,
    IndustryCategorySerializer,
    PrincipleSerializer,
    HomepageContentSerializer,
    LegalPageSerializer,
)


class ServiceGroupViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ServiceGroup.objects.filter(is_active=True).prefetch_related("services")
    serializer_class = ServiceGroupSerializer
    lookup_field = "slug"
    permission_classes = [permissions.AllowAny]


class ServiceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Service.objects.filter(is_active=True).select_related("group")
    serializer_class = ServiceSerializer
    lookup_field = "slug"
    permission_classes = [permissions.AllowAny]


class GrowthStageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = GrowthStage.objects.all().order_by("step_number")
    serializer_class = GrowthStageSerializer
    lookup_field = "slug"
    permission_classes = [permissions.AllowAny]


class IndustryCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = IndustryCategory.objects.filter(is_active=True)
    serializer_class = IndustryCategorySerializer
    lookup_field = "slug"
    permission_classes = [permissions.AllowAny]


class PrincipleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Principle.objects.filter(is_active=True)
    serializer_class = PrincipleSerializer
    permission_classes = [permissions.AllowAny]


class HomepageContentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = HomepageContent.objects.all()
    serializer_class = HomepageContentSerializer
    lookup_field = "section_key"
    permission_classes = [permissions.AllowAny]


class LegalPageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = LegalPage.objects.all()
    serializer_class = LegalPageSerializer
    lookup_field = "slug"
    permission_classes = [permissions.AllowAny]
