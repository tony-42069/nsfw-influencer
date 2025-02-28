# src/core/engagement.py
from typing import Dict, Optional, List
import logging
from datetime import datetime
import json
import os
from src.utils.config import load_config
from src.core.personality import PersonalityEngine

logger = logging.getLogger(__name__)

class EngagementSystem:
    def __init__(self):
        self.config = load_config()["personality"]
        self.engagement_rules = self.config["engagement_rules"]
        self.personality = PersonalityEngine()
        self.recent_interactions = []
        self.max_stored_interactions = 20
        self.platforms = ["x", "fansly"]  # Supported platforms
        
        # Map user types to priority values
        self.user_type_map = {
            "follower": "subscribers",  # Map follower to subscribers
            "visitor": "new_users",     # Map visitor to new_users
            "regular": "regular_engagers"  # Map regular to regular_engagers
        }

    async def process_interaction(self, interaction_data: Dict) -> Dict:
        """Process and respond to user interactions"""
        try:
            # Extract interaction details
            interaction_type = interaction_data.get("type", "comment")
            user_id = interaction_data.get("user_id", "anonymous")
            user_message = interaction_data.get("message", "")
            user_type = interaction_data.get("user_type", "follower")
            platform = interaction_data.get("platform", "x")
            
            logger.info(f"Processing {interaction_type} from {user_type} on {platform}: {user_message[:50]}...")
            
            # Determine response priority based on user type with mapping
            mapped_user_type = self.user_type_map.get(user_type, "new_users")
            priority = self.engagement_rules["response_priority"].get(
                mapped_user_type, self.engagement_rules["response_priority"]["new_users"]
            )
            
            # Create prompt for response generation based on interaction type
            if interaction_type == "directMessage":
                prompt = f"""This is a direct message from a {user_type} on {platform}: "{user_message}"
                Respond in a personal and engaging way that fits the platform {platform}.
                The user is a {user_type} so give them {priority} priority attention."""
            elif interaction_type == "comment":
                prompt = f"""This is a comment on your {platform} post: "{user_message}"
                Respond in a way that encourages further engagement on {platform}.
                The user is a {user_type} so give them {priority} priority attention."""
            elif interaction_type == "mention":
                prompt = f"""You've been mentioned on {platform}: "{user_message}"
                Respond in a way that's appropriate for a public mention on {platform}.
                The user is a {user_type} so give them {priority} priority attention."""
            else:
                prompt = f"""Respond to this user interaction on {platform}: "{user_message}"
                Be authentic and on-brand in your response.
                The user is a {user_type} so give them {priority} priority attention."""
            
            # Generate response using personality engine
            response_text = await self.personality.generate_response(prompt)
            
            # Store interaction for history
            interaction_record = {
                "id": f"int_{datetime.now().timestamp()}",
                "user_id": user_id,
                "user_type": user_type,
                "platform": platform,
                "interaction_type": interaction_type,
                "message": user_message,
                "response": response_text,
                "priority": priority,
                "processed_at": datetime.now().isoformat()
            }
            
            self._store_interaction(interaction_record)
            
            logger.info(f"Processed {interaction_type} from {user_id} - Response length: {len(response_text)}")
            
            return {
                "status": "success",
                "response": response_text,
                "user_id": user_id,
                "interaction_type": interaction_type,
                "platform": platform,
                "processed_at": datetime.now().isoformat(),
                "priority": priority
            }
        except Exception as e:
            logger.error(f"Error processing interaction: {str(e)}")
            raise
    
    def _store_interaction(self, interaction: Dict):
        """Store interaction in recent history"""
        self.recent_interactions.insert(0, interaction)  # Add to beginning of list
        if len(self.recent_interactions) > self.max_stored_interactions:
            self.recent_interactions = self.recent_interactions[:self.max_stored_interactions]
            
    async def get_engagement_stats(self) -> Dict:
        """Get current engagement statistics"""
        return {
            "response_times": self.engagement_rules["response_priority"],
            "interaction_limits": self.engagement_rules["interaction_limits"],
            "platforms": self.platforms,
            "recent_count": len(self.recent_interactions),
            "last_updated": datetime.now().isoformat()
        }
        
    async def get_recent_interactions(self, limit: int = 10) -> List[Dict]:
        """Get recent interactions history"""
        return self.recent_interactions[:limit]