import requests
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.conf import settings
from .models import Article


@receiver([post_save, post_delete], sender=Article)
def revalidate_blog_cache(sender, instance, **kwargs):
    secret = getattr(settings, "NEXTJS_REVALIDATE_SECRET", None)
    endpoint = getattr(settings, "NEXTJS_INTERNAL_URL", None)
    if not secret or not endpoint:
        return
    try:
        # Revalidate blog listing and specific article slug
        requests.post(
            f"{endpoint}/api/revalidate",
            json={"tag": f"article-{instance.slug}", "secret": secret},
            timeout=2.0,
        )
        requests.post(
            f"{endpoint}/api/revalidate", json={"tag": "articles", "secret": secret}, timeout=2.0
        )
    except Exception:
        pass
