from rest_framework import generics, permissions
from rest_framework.throttling import AnonRateThrottle
from .models import Lead
from .serializers import LeadSubmissionSerializer


class ContactRateThrottle(AnonRateThrottle):
    rate = "5/hour"


class LeadCreateView(generics.CreateAPIView):
    queryset = Lead.objects.all()
    serializer_class = LeadSubmissionSerializer
    permission_classes = [permissions.AllowAny]
    throttle_classes = [ContactRateThrottle]
