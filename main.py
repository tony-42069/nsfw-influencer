# main.py
from fastapi import FastAPI
from src.api.webhook_handlers import router as webhook_router
from src.utils.config import load_config
import uvicorn
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="NSFW Influencer Engine",
    description="AI Personality and Content Management System",
    version="1.0.0"
)

# Include routers
app.include_router(webhook_router, prefix="/api/v1")

if __name__ == "__main__":
    config = load_config()
    uvicorn.run(
        "main:app", 
        host=config.get("host", "0.0.0.0"), 
        port=config.get("port", 8000), 
        reload=True
    )

# src/api/webhook_handlers.py
from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.responses import JSONResponse
from datetime import datetime
from typing import Optional
from src.core.personality import PersonalityEngine
from src.core.content_manager import ContentManager
from src.core.engagement import EngagementSystem
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

# Initialize core systems
personality_engine = PersonalityEngine()
content_manager = ContentManager()
engagement_system = EngagementSystem()

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@router.post("/webhook/fansly")
async def fansly_webhook(request: Request):
    """Handle Fansly platform webhooks"""
    try:
        payload = await request.json()
        # TODO: Implement webhook handling
        return {"status": "received", "payload": payload}
    except Exception as e:
        logger.error(f"Error processing Fansly webhook: {str(e)}")
        raise HTTPException(status_code=500, detail="Webhook processing failed")

@router.post("/personality/generate")
async def generate_response(prompt: str):
    """Generate personality-driven response"""
    try:
        response = await personality_engine.generate_response(prompt)
        return {"response": response}
    except Exception as e:
        logger.error(f"Error generating response: {str(e)}")
        raise HTTPException(status_code=500, detail="Response generation failed")

@router.post("/content/create")
async def create_content(content_type: str, params: Optional[dict] = None):
    """Generate new content"""
    try:
        content = await content_manager.generate_content(content_type, params)
        return {"content": content}
    except Exception as e:
        logger.error(f"Error creating content: {str(e)}")
        raise HTTPException(status_code=500, detail="Content creation failed")

@router.post("/engagement/interact")
async def handle_interaction(interaction_data: dict):
    """Process user interaction"""
    try:
        response = await engagement_system.process_interaction(interaction_data)
        return {"status": "success", "response": response}
    except Exception as e:
        logger.error(f"Error processing interaction: {str(e)}")
        raise HTTPException(status_code=500, detail="Interaction processing failed")