from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Project
from .serializers import ProjectListSerializer, ProjectDetailSerializer


class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    lookup_field = "slug"
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["industry__slug", "services__slug", "is_featured"]
    search_fields = ["title", "short_description", "client_name"]
    ordering_fields = ["published_at", "created_at"]

    def get_queryset(self):
        user = self.request.user
        preview = self.request.query_params.get("preview") == "true"
        if (user.is_authenticated and user.is_staff) or preview:
            return (
                Project.objects.all()
                .select_related("industry")
                .prefetch_related("services", "gallery")
            )
        return (
            Project.objects.filter(is_published=True)
            .select_related("industry")
            .prefetch_related("services", "gallery")
        )

    def get_serializer_class(self):
        if self.action == "list":
            return ProjectListSerializer
        return ProjectDetailSerializer
