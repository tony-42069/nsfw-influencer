# src/core/content_manager.py
from typing import Dict, Optional, List
import logging
from datetime import datetime
import os
import json
from src.utils.config import load_config
from src.core.personality import PersonalityEngine
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

class ContentManager:
    def __init__(self):
        self.config = load_config()["personality"]
        self.post_templates = self.config["content_preferences"]
        self.personality = PersonalityEngine()
        
    async def generate_content(self, content_type: str, params: Optional[Dict] = None) -> Dict:
        """Generate new content including text and images"""
        try:
            # Get content preferences
            topics = self.post_templates["topics"]
            content_style = self.post_templates["content_style"]
            
            # Create prompt for content generation
            if content_type == "post":
                prompt = f"""Create a social media post about one of these topics: {', '.join(topics[:3])}.
                The post should be {content_style['text_length']['medium']} in length.
                Use a {content_style['tone_variations'][0]} tone.
                Include hashtags at the end."""
            elif content_type == "story":
                prompt = f"""Create a short story or anecdote about {topics[0]} or {topics[1]}.
                Keep it brief and engaging, perfect for a social media story.
                Use a {content_style['tone_variations'][1]} tone."""
            elif content_type == "reply":
                prompt = f"""Create a reply to a fan who said: '{params.get('comment', 'I love your content!')}' 
                Keep it personal and authentic.
                Use a {content_style['tone_variations'][2]} tone."""
            else:
                prompt = f"""Create some engaging content about {topics[0]}.
                Make it {content_style['text_length']['short']} in length.
                Use a {content_style['tone_variations'][3]} tone."""
            
            # Generate content using personality engine
            content_text = await self.personality.generate_response(prompt)
            
            logger.info(f"Generated {content_type} content")
            return {
                "type": content_type,
                "text": content_text,
                "image_url": None,  # No image generation in MVP
                "created_at": datetime.now().isoformat(),
                "topics": topics[:3],
                "tone": content_style['tone_variations'][0]
            }
        except Exception as e:
            logger.error(f"Error generating content: {str(e)}")
            raise
            
    async def schedule_content(self, content: Dict, publish_time: Optional[str] = None) -> Dict:
        """Schedule content for publishing (simplified for MVP)"""
        try:
            # For MVP, we'll just return the content with a scheduled time
            scheduled_time = publish_time or (datetime.now().isoformat())
            
            return {
                **content,
                "scheduled_for": scheduled_time,
                "status": "scheduled"
            }
        except Exception as e:
            logger.error(f"Error scheduling content: {str(e)}")
            raise