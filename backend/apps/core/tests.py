from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from apps.content.models import GrowthStage, ServiceGroup, Service
from apps.leads.models import Lead


class ThunsparkContentAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.stage = GrowthStage.objects.create(
            name="Discover",
            slug="discover",
            step_number=1,
            description="Deep market and search intent audit.",
        )
        self.group = ServiceGroup.objects.create(
            name="Growth Strategy", slug="growth-strategy", summary="Strategic growth foundation."
        )
        self.service = Service.objects.create(
            group=self.group,
            name="Digital Strategy",
            slug="digital-strategy",
            problem="Disconnected marketing activity.",
            approach="Comprehensive channel mapping.",
            business_objective="Multi-quarter predictable pipeline.",
        )

    def test_growth_stages_endpoint(self):
        url = reverse("growth-stage-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Handle paginated or list response
        results = (
            response.data.get("results", response.data)
            if isinstance(response.data, dict)
            else response.data
        )
        self.assertTrue(len(results) >= 1)
        self.assertEqual(results[0]["name"], "Discover")

    def test_service_groups_endpoint(self):
        url = reverse("service-group-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = (
            response.data.get("results", response.data)
            if isinstance(response.data, dict)
            else response.data
        )
        self.assertTrue(len(results) >= 1)
        self.assertEqual(results[0]["name"], "Growth Strategy")
        self.assertEqual(len(results[0]["services"]), 1)


class ThunsparkLeadSubmissionTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_valid_lead_submission_with_attribution(self):
        url = reverse("lead-submit")
        payload = {
            "name": "Sarah Connor",
            "email": "sarah@cyberdyne.io",
            "company": "Cyberdyne Systems",
            "website": "https://cyberdyne.io",
            "improvement_goal": "Need conversion architecture for enterprise B2B.",
            "budget": "5k_10k",
            "message": "Let's discuss scaling our growth funnel.",
            "attribution": {
                "first_touch": {
                    "utm_source": "linkedin",
                    "utm_medium": "paid_social",
                    "utm_campaign": "q1_b2b_growth",
                    "landing_page": "/services",
                },
                "last_touch": {
                    "utm_source": "google",
                    "utm_medium": "organic",
                    "landing_page": "/contact",
                },
                "gclid": "test_gclid_12345",
            },
        }
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        lead = Lead.objects.get(email="sarah@cyberdyne.io")
        self.assertEqual(lead.first_touch_source, "linkedin")
        self.assertEqual(lead.first_touch_campaign, "q1_b2b_growth")
        self.assertEqual(lead.last_touch_source, "google")
        self.assertEqual(lead.gclid, "test_gclid_12345")

    def test_spam_honeypot_trap(self):
        url = reverse("lead-submit")
        payload = {
            "name": "Spam Bot",
            "email": "bot@spammer.net",
            "website_hp": "http://spam-link.com",  # Honeypot triggered
        }
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Lead.objects.filter(email="bot@spammer.net").count(), 0)
