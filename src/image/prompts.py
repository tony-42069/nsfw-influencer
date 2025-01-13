# src/image/prompts.py
from typing import Dict, List, Optional
import random

class PromptGenerator:
    def __init__(self):
        self.templates = {
            "lifestyle": [
                "A conservative millennial mom {action} {location}",
                "Patriotic scene with {object} and {background}"
            ],
            "politics": [
                "Conservative values represented by {symbol}",
                "Traditional family scene with {activity}"
            ]
        }
        
    def generate_prompt(self, category: str, params: Optional[Dict] = None) -> str:
        """Generate an image prompt based on category and parameters"""
        templates = self.templates.get(category, [])
        if not templates:
            raise ValueError(f"Invalid category: {category}")
            
        template = random.choice(templates)
        # TODO: Implement parameter substitution
        return template