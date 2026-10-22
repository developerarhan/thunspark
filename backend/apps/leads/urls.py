from django.urls import path
from .views import LeadCreateView

urlpatterns = [
    path("submit/", LeadCreateView.as_view(), name="lead-submit"),
]
