from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ServiceGroupViewSet,
    ServiceViewSet,
    GrowthStageViewSet,
    IndustryCategoryViewSet,
    PrincipleViewSet,
    HomepageContentViewSet,
    LegalPageViewSet,
)

router = DefaultRouter()
router.register(r"service-groups", ServiceGroupViewSet, basename="service-group")
router.register(r"services", ServiceViewSet, basename="service")
router.register(r"growth-stages", GrowthStageViewSet, basename="growth-stage")
router.register(r"industries", IndustryCategoryViewSet, basename="industry")
router.register(r"principles", PrincipleViewSet, basename="principle")
router.register(r"homepage", HomepageContentViewSet, basename="homepage-content")
router.register(r"legal", LegalPageViewSet, basename="legal-page")

urlpatterns = [
    path("", include(router.urls)),
]
