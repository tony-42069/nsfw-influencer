# src/utils/config.py
import json
from pathlib import Path
from typing import Dict, Any

class ConfigManager:
    def __init__(self):
        self.config_dir = Path(__file__).parent.parent.parent / 'config'
        self.system_config = self._load_config('system_config.json')
        self.personality_config = self._load_config('personality_config.json')

    def _load_config(self, filename: str) -> Dict[str, Any]:
        """Load a configuration file"""
        config_path = self.config_dir / filename
        with open(config_path) as f:
            return json.load(f)

    def get_system_config(self) -> Dict[str, Any]:
        """Get system configuration"""
        return self.system_config

    def get_personality_config(self) -> Dict[str, Any]:
        """Get personality configuration"""
        return self.personality_config