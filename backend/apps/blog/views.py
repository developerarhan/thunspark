from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Article, Category, Tag
from .serializers import (
    ArticleListSerializer,
    ArticleDetailSerializer,
    CategorySerializer,
    TagSerializer,
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = "slug"
    permission_classes = [permissions.AllowAny]


class TagViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    lookup_field = "slug"
    permission_classes = [permissions.AllowAny]


class ArticleViewSet(viewsets.ReadOnlyModelViewSet):
    lookup_field = "slug"
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["category__slug", "tags__slug", "is_featured"]
    search_fields = ["title", "excerpt", "content"]
    ordering_fields = ["published_at", "views_count"]

    def get_queryset(self):
        user = self.request.user
        preview = self.request.query_params.get("preview") == "true"
        if (user.is_authenticated and user.is_staff) or preview:
            return (
                Article.objects.all().select_related("category", "author").prefetch_related("tags")
            )
        return (
            Article.objects.filter(status="published")
            .select_related("category", "author")
            .prefetch_related("tags")
        )

    def get_serializer_class(self):
        if self.action == "list":
            return ArticleListSerializer
        return ArticleDetailSerializer
