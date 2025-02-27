# src/core/engagement.py
from typing import Dict, Optional, List
import logging
from datetime import datetime
from src.utils.config import load_config
from src.core.personality import PersonalityEngine

logger = logging.getLogger(__name__)

class EngagementSystem:
    def __init__(self):
        self.config = load_config()["personality"]
        self.engagement_rules = self.config["engagement_rules"]
        self.personality = PersonalityEngine()
        
    async def process_interaction(self, interaction_data: Dict) -> Dict:
        """Process and respond to user interactions"""
        try:
            # Extract interaction details
            interaction_type = interaction_data.get("type", "comment")
            user_id = interaction_data.get("user_id", "anonymous")
            user_message = interaction_data.get("message", "")
            user_type = interaction_data.get("user_type", "free_user")
            
            # Determine response priority based on user type
            priority = self.engagement_rules["response_priority"].get(
                user_type, self.engagement_rules["response_priority"]["new_users"]
            )
            
            # Create prompt for response generation
            if interaction_type == "dm":
                prompt = f"""This is a direct message from a user: "{user_message}"
                Respond in a personal and engaging way.
                The user is a {user_type} so give them {priority} priority attention."""
            elif interaction_type == "comment":
                prompt = f"""This is a comment on your post: "{user_message}"
                Respond in a way that encourages further engagement.
                The user is a {user_type} so give them {priority} priority attention."""
            else:
                prompt = f"""Respond to this user interaction: "{user_message}"
                Be authentic and on-brand in your response.
                The user is a {user_type} so give them {priority} priority attention."""
            
            # Generate response using personality engine
            response_text = await self.personality.generate_response(prompt)
            
            logger.info(f"Processed {interaction_type} from {user_id}")
            return {
                "status": "success",
                "response": response_text,
                "user_id": user_id,
                "interaction_type": interaction_type,
                "processed_at": datetime.now().isoformat(),
                "priority": priority
            }
        except Exception as e:
            logger.error(f"Error processing interaction: {str(e)}")
            raise
            
    async def get_engagement_stats(self) -> Dict:
        """Get current engagement statistics (simplified for MVP)"""
        return {
            "response_times": self.engagement_rules["response_priority"],
            "interaction_limits": self.engagement_rules["interaction_limits"],
            "last_updated": datetime.now().isoformat()
        }