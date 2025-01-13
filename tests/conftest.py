# tests/conftest.py
import pytest
from typing import Dict
import json
import os

@pytest.fixture
def mock_config() -> Dict:
    return {
        "personality": {
            "base_traits": {
                "age": "early 30s",
                "personality": "fun, perky, patriotic",
                "interests": ["conservative politics", "lifestyle", "family"]
            },
            "conversation_style": {
                "formality": "casual",
                "humor_level": "medium",
                "response_length": "medium"
            }
        },
        "content": {
            "post_template": {
                "standard": {
                    "text_length": "100-150",
                    "image_required": True
                }
            }
        },
        "engagement": {
            "response_time": {
                "free_users": "2-4",
                "subscribers": "0.5-1"
            },
            "daily_limits": {
                "dms": 100,
                "posts": 3
            }
        },
        "image_generation": {
            "model": "stable-diffusion",
            "safety_filters": True
        }
    }
