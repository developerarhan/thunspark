import requests
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.conf import settings
from .models import (
    ServiceGroup,
    Service,
    GrowthStage,
    IndustryCategory,
    Principle,
    HomepageContent,
    LegalPage,
)


def trigger_revalidation(tag: str):
    """Notify Next.js frontend to revalidate cached pages/data with the given tag."""
    secret = getattr(settings, "NEXTJS_REVALIDATE_SECRET", None)
    endpoint = getattr(settings, "NEXTJS_INTERNAL_URL", None)
    if not secret or not endpoint:
        return
    try:
        requests.post(
            f"{endpoint}/api/revalidate", json={"tag": tag, "secret": secret}, timeout=2.5
        )
    except Exception:
        # Avoid breaking admin saves if frontend is down or spinning up
        pass


@receiver([post_save, post_delete], sender=ServiceGroup)
@receiver([post_save, post_delete], sender=Service)
def revalidate_services_cache(sender, instance, **kwargs):
    trigger_revalidation("services")
    trigger_revalidation("homepage")


@receiver([post_save, post_delete], sender=GrowthStage)
@receiver([post_save, post_delete], sender=IndustryCategory)
@receiver([post_save, post_delete], sender=Principle)
@receiver([post_save, post_delete], sender=HomepageContent)
def revalidate_homepage_cache(sender, instance, **kwargs):
    trigger_revalidation("homepage")


@receiver([post_save, post_delete], sender=LegalPage)
def revalidate_legal_cache(sender, instance, **kwargs):
    trigger_revalidation(f"legal-{instance.slug}")
