from rest_framework import serializers
from .models import Lead
from .tasks import send_lead_notification_email


class LeadSubmissionSerializer(serializers.ModelSerializer):
    # Hidden honeypot field to trap spam bots silently
    website_hp = serializers.CharField(required=False, write_only=True, allow_blank=True)
    attribution = serializers.JSONField(required=False, write_only=True)

    class Meta:
        model = Lead
        fields = [
            "id",
            "name",
            "email",
            "company",
            "website",
            "improvement_goal",
            "budget",
            "message",
            "website_hp",
            "attribution",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def validate_website_hp(self, value):
        if value:
            # Bot detected!
            raise serializers.ValidationError("Spam protection triggered.")
        return value

    def create(self, validated_data):
        validated_data.pop("website_hp", None)
        attribution_data = validated_data.pop("attribution", {}) or {}
        first = attribution_data.get("first_touch", {}) or {}
        last = attribution_data.get("last_touch", {}) or {}

        request = self.context.get("request")
        ip = None
        user_agent = ""
        if request:
            x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
            if x_forwarded_for:
                ip = x_forwarded_for.split(",")[0].strip()
            else:
                ip = request.META.get("REMOTE_ADDR")
            user_agent = request.META.get("HTTP_USER_AGENT", "")

        lead = Lead.objects.create(
            **validated_data,
            first_touch_source=first.get("utm_source", ""),
            first_touch_medium=first.get("utm_medium", ""),
            first_touch_campaign=first.get("utm_campaign", ""),
            first_touch_term=first.get("utm_term", ""),
            first_touch_content=first.get("utm_content", ""),
            first_referrer=first.get("referrer", ""),
            first_landing_page=first.get("landing_page", ""),
            last_touch_source=last.get("utm_source", ""),
            last_touch_medium=last.get("utm_medium", ""),
            last_touch_campaign=last.get("utm_campaign", ""),
            last_referrer=last.get("referrer", ""),
            last_landing_page=last.get("landing_page", ""),
            gclid=attribution_data.get("gclid", ""),
            fbclid=attribution_data.get("fbclid", ""),
            msclkid=attribution_data.get("msclkid", ""),
            raw_attribution=attribution_data,
            ip_address=ip,
            user_agent=user_agent,
        )

        # Trigger async Celery notification email
        try:
            send_lead_notification_email.delay(lead.id)
        except Exception:
            # Fallback to direct synchronous email if Celery worker is offline
            pass

        return lead
