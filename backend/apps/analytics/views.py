from rest_framework import generics, permissions
from .models import TrackingConfig
from .serializers import TrackingConfigSerializer


class ActiveTrackingConfigsView(generics.ListAPIView):
    """Endpoint consumed by Next.js to initialize approved tracking tags."""

    serializer_class = TrackingConfigSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return TrackingConfig.objects.filter(is_enabled=True)
