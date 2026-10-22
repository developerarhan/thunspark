from abc import ABC, abstractmethod
from typing import Any


class BaseCRMIntegration(ABC):
    """Abstract interface for third-party CRM connectors (HubSpot, Pipedrive, Salesforce, Webhooks)."""

    @abstractmethod
    def create_contact(self, lead_data: dict[str, Any]) -> str:
        """Create or update contact in external CRM. Return external CRM contact ID."""
        pass

    @abstractmethod
    def update_contact(self, crm_id: str, data: dict[str, Any]) -> bool:
        """Update contact properties."""
        pass

    @abstractmethod
    def is_configured(self) -> bool:
        """Returns True if required API credentials exist."""
        pass


class GenericWebhookIntegration(BaseCRMIntegration):
    """Dispatches webhook payloads to Zapier, Make, n8n, or custom CRM endpoint."""

    def __init__(self, webhook_url: str = "", headers: dict = None):
        self.webhook_url = webhook_url
        self.headers = headers or {"Content-Type": "application/json"}

    def create_contact(self, lead_data: dict[str, Any]) -> str:
        if not self.is_configured():
            return ""
        import requests

        try:
            response = requests.post(
                self.webhook_url, json=lead_data, headers=self.headers, timeout=5
            )
            response.raise_for_status()
            return response.json().get("id", "synced")
        except Exception:
            return ""

    def update_contact(self, crm_id: str, data: dict[str, Any]) -> bool:
        return False

    def is_configured(self) -> bool:
        return bool(self.webhook_url and self.webhook_url.startswith("http"))
