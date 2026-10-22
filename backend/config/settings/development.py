from .base import *  # noqa: F403
import os
import sys

DEBUG = True

# Fast SQLite test database during automated test execution
if "test" in sys.argv or "pytest" in sys.modules or os.environ.get("DJANGO_TEST"):
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "test_db.sqlite3",  # noqa: F405
        }
    }
