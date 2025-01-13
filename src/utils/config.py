import json
import os
from typing import Dict
from dotenv import load_dotenv

load_dotenv()
print(f"OpenAI Key loaded: {'OPENAI_API_KEY' in os.environ}")
print(f"First few characters of key if present: {os.environ.get('OPENAI_API_KEY', 'NOT_FOUND')[:5]}...")

def load_config() -> Dict:
    """Load configuration from JSON files"""
    config = {}
    
    # Define the config directory relative to this file
    config_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'config')
    
    try:
        # Load personality config
        personality_path = os.path.join(config_dir, 'personality_config.json')
        if os.path.exists(personality_path):
            with open(personality_path, 'r', encoding='utf-8') as f:
                config['personality'] = json.load(f)
        
        # Load system config
        system_path = os.path.join(config_dir, 'system_config.json')
        if os.path.exists(system_path):
            with open(system_path, 'r', encoding='utf-8') as f:
                config['system'] = json.load(f)
        else:
            config['system'] = {}

        # Add required configurations if they don't exist
        if 'content' not in config:
            config['content'] = {
                "post_template": {
                    "standard": {
                        "text_length": "100-150",
                        "image_required": True
                    }
                }
            }

        if 'engagement' not in config:
            config['engagement'] = {
                "response_time": {
                    "free_users": "2-4",
                    "subscribers": "0.5-1"
                },
                "daily_limits": {
                    "dms": 100,
                    "posts": 3
                }
            }

        if 'image_generation' not in config:
            config['image_generation'] = {
                "model": "stable-diffusion",
                "safety_filters": True
            }

        return config

    except Exception as e:
        import traceback
        print(f"Error stack trace: {traceback.format_exc()}")
        raise Exception(f"Error loading configuration: {str(e)}")