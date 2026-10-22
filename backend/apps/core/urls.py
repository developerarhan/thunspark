from django.urls import path
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import serializers


class HealthCheckSerializer(serializers.Serializer):
    status = serializers.CharField()
    version = serializers.CharField()


class HealthCheckView(APIView):
    serializer_class = HealthCheckSerializer

    def get(self, request):
        return Response({"status": "healthy", "version": "1.0.0"})


urlpatterns = [
    path("health/", HealthCheckView.as_view(), name="health-check"),
]
