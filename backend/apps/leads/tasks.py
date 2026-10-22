from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from .models import Lead


@shared_task(bind=True, max_retries=3)
def send_lead_notification_email(self, lead_id: int):
    try:
        lead = Lead.objects.get(id=lead_id)
    except Lead.DoesNotExist:
        return

    subject = f"🔥 New Growth Inquiry: {lead.name} ({lead.company or 'Direct'})"
    message = f"""
New Inquiry Received on Thunspark!

Lead Information:
-----------------
Name: {lead.name}
Email: {lead.email}
Company: {lead.company}
Website: {lead.website}
Budget: {lead.get_budget_display() if lead.budget else "Not specified"}
Goal / Bottleneck: {lead.improvement_goal}

Message:
{lead.message}

Attribution & Acquisition Path:
--------------------------------
First Touch: {lead.first_touch_source} / {lead.first_touch_medium} ({lead.first_touch_campaign})
First Landing Page: {lead.first_landing_page}
First Referrer: {lead.first_referrer}

Last Touch: {lead.last_touch_source} / {lead.last_touch_medium} ({lead.last_touch_campaign})
Last Landing Page: {lead.last_landing_page}

Click IDs: Google={lead.gclid or "None"} | Meta={lead.fbclid or "None"}
IP / Agent: {lead.ip_address}

Received At: {lead.created_at.strftime("%Y-%m-%d %H:%M:%S UTC")}
    """.strip()

    recipient = getattr(settings, "NOTIFICATION_RECIPIENT_EMAIL", "team@thunspark.agency")
    from_email = getattr(settings, "DEFAULT_FROM_EMAIL", "leads@thunspark.agency")

    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=from_email,
            recipient_list=[recipient],
            fail_silently=False,
        )
    except Exception as exc:
        raise self.retry(exc=exc, countdown=30)
