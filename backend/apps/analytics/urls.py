from django.urls import path
from .views import ActiveTrackingConfigsView

urlpatterns = [
    path("active/", ActiveTrackingConfigsView.as_view(), name="active-tracking-configs"),
]
