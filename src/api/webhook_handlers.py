# src/api/webhook_handlers.py
from fastapi import APIRouter, HTTPException, Request, Header, Depends
from typing import Optional, Dict
import logging
from datetime import datetime
import json
import hmac
import hashlib
from src.core.personality import PersonalityEngine
from src.core.content_manager import ContentManager
from src.core.engagement import EngagementSystem
from src.api.fansly_client import FanslyClient
from src.utils.config import load_config

logger = logging.getLogger(__name__)
router = APIRouter()

# Initialize core systems
personality_engine = PersonalityEngine()
content_manager = ContentManager()
engagement_system = EngagementSystem()
fansly_client = FanslyClient()

async def verify_webhook_signature(
    request: Request,
    x_fansly_signature: Optional[str] = Header(None)
) -> bool:
    """Verify webhook signature from Fansly"""
    if not x_fansly_signature:
        raise HTTPException(status_code=401, detail="Missing signature header")
    
    config = load_config()
    webhook_secret = config["fansly"]["webhook_secret"]
    
    try:
        body = await request.body()
        signature = hmac.new(
            webhook_secret.encode(),
            body,
            hashlib.sha256
        ).hexdigest()
        return hmac.compare_digest(signature, x_fansly_signature)
    except Exception as e:
        logger.error(f"Signature verification failed: {str(e)}")
        return False

@router.post("/webhook/fansly")
async def fansly_webhook(
    request: Request,
    verified: bool = Depends(verify_webhook_signature)
):
    """Handle incoming webhooks from Fansly"""
    if not verified:
        raise HTTPException(status_code=401, detail="Invalid webhook signature")
    
    try:
        payload = await request.json()
        event_type = payload.get("type")
        
        response = await process_fansly_event(event_type, payload)
        return response
        
    except Exception as e:
        logger.error(f"Error processing webhook: {str(e)}")
        raise HTTPException(status_code=500, detail="Webhook processing failed")

async def process_fansly_event(event_type: str, payload: Dict) -> Dict:
    """Process different types of Fansly events"""
    handlers = {
        "message": handle_message_event,
        "subscription": handle_subscription_event,
        "tip": handle_tip_event,
        "comment": handle_comment_event,
        "like": handle_like_event
    }
    
    handler = handlers.get(event_type)
    if not handler:
        logger.warning(f"Unhandled event type: {event_type}")
        return {"status": "ignored", "reason": "unsupported_event_type"}
        
    return await handler(payload)

async def handle_message_event(payload: Dict) -> Dict:
    """Handle incoming direct messages"""
    try:
        user_id = payload.get("user_id")
        message = payload.get("message")
        
        # Generate personality-driven response
        response = await personality_engine.generate_response(
            prompt=message,
            context={"user_id": user_id}
        )
        
        # Send response through Fansly
        await fansly_client.send_dm(user_id, response)
        
        # Track engagement
        await engagement_system.process_interaction({
            "type": "message",
            "user_id": user_id,
            "content": message,
            "response": response,
            "timestamp": datetime.now().isoformat()
        })
        
        return {
            "status": "success",
            "event": "message",
            "user_id": user_id
        }
        
    except Exception as e:
        logger.error(f"Error handling message event: {str(e)}")
        raise

async def handle_subscription_event(payload: Dict) -> Dict:
    """Handle new subscriptions"""
    try:
        user_id = payload.get("user_id")
        tier = payload.get("tier")
        
        # Generate welcome message
        welcome_msg = await personality_engine.generate_response(
            prompt="new_subscriber_welcome",
            context={"user_id": user_id, "tier": tier}
        )
        
        # Send welcome message
        await fansly_client.send_dm(user_id, welcome_msg)
        
        # Track subscription
        await engagement_system.process_interaction({
            "type": "subscription",
            "user_id": user_id,
            "tier": tier,
            "timestamp": datetime.now().isoformat()
        })
        
        return {
            "status": "success",
            "event": "subscription",
            "user_id": user_id,
            "tier": tier
        }
        
    except Exception as e:
        logger.error(f"Error handling subscription event: {str(e)}")
        raise

async def handle_tip_event(payload: Dict) -> Dict:
    """Handle tips from users"""
    try:
        user_id = payload.get("user_id")
        amount = payload.get("amount")
        
        # Generate thank you message
        thank_you = await personality_engine.generate_response(
            prompt="tip_thanks",
            context={"user_id": user_id, "amount": amount}
        )
        
        # Send thank you message
        await fansly_client.send_dm(user_id, thank_you)
        
        # Track tip
        await engagement_system.process_interaction({
            "type": "tip",
            "user_id": user_id,
            "amount": amount,
            "timestamp": datetime.now().isoformat()
        })
        
        return {
            "status": "success",
            "event": "tip",
            "user_id": user_id,
            "amount": amount
        }
        
    except Exception as e:
        logger.error(f"Error handling tip event: {str(e)}")
        raise

async def handle_comment_event(payload: Dict) -> Dict:
    """Handle comments on content"""
    try:
        user_id = payload.get("user_id")
        comment = payload.get("comment")
        post_id = payload.get("post_id")
        
        # Generate response if needed
        if should_respond_to_comment(comment):
            response = await personality_engine.generate_response(
                prompt=comment,
                context={"user_id": user_id, "post_id": post_id}
            )
            await fansly_client.reply_to_comment(post_id, comment, response)
        
        # Track comment
        await engagement_system.process_interaction({
            "type": "comment",
            "user_id": user_id,
            "post_id": post_id,
            "content": comment,
            "timestamp": datetime.now().isoformat()
        })
        
        return {
            "status": "success",
            "event": "comment",
            "user_id": user_id,
            "post_id": post_id
        }
        
    except Exception as e:
        logger.error(f"Error handling comment event: {str(e)}")
        raise

async def handle_like_event(payload: Dict) -> Dict:
    """Handle likes on content"""
    try:
        user_id = payload.get("user_id")
        post_id = payload.get("post_id")
        
        # Track like
        await engagement_system.process_interaction({
            "type": "like",
            "user_id": user_id,
            "post_id": post_id,
            "timestamp": datetime.now().isoformat()
        })
        
        return {
            "status": "success",
            "event": "like",
            "user_id": user_id,
            "post_id": post_id
        }
        
    except Exception as e:
        logger.error(f"Error handling like event: {str(e)}")
        raise

def should_respond_to_comment(comment: str) -> bool:
    """Determine if a comment needs a response"""
    # TODO: Implement comment response logic
    return True