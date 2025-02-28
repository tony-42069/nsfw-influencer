# main.py
from fastapi import FastAPI, HTTPException, Request, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from typing import Dict, Optional, List
from datetime import datetime
import logging
import uvicorn
import json
import os
from dotenv import load_dotenv

from src.core.personality import PersonalityEngine
from src.core.content_manager import ContentManager
from src.core.engagement import EngagementSystem
from src.utils.config import load_config

# Load environment variables
load_dotenv()

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
    version="0.1.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set up static files and templates
app.mount("/static", StaticFiles(directory="web/static"), name="static")
templates = Jinja2Templates(directory="web/templates")

# Initialize core systems
personality_engine = PersonalityEngine()
content_manager = ContentManager()
engagement_system = EngagementSystem()

# Define API models
class ContentRequest(BaseModel):
    topic: str
    content_type: str
    tone: Optional[str] = "casual"
    word_count: Optional[int] = 150
    
class InteractionRequest(BaseModel):
    type: str
    user_id: Optional[str] = "anonymous"
    message: str
    user_type: Optional[str] = "free_user"
    
class PersonalityUpdateRequest(BaseModel):
    base_traits: Optional[Dict] = None
    conversation_style: Optional[Dict] = None

# Web Routes
@app.get("/")
async def web_root(request: Request):
    """Serve the web interface"""
    return templates.TemplateResponse("index.html", {"request": request})

# API Routes
@app.get("/api")
async def api_root():
    return {"message": "NSFW Influencer Engine API", "version": "0.1.0"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/api/personality/generate")
async def generate_response(prompt: str = Body(..., embed=True)):
    """Generate personality-driven response"""
    try:
        response = await personality_engine.generate_response(prompt)
        return {"success": True, "response": response}
    except Exception as e:
        logger.error(f"Error generating response: {str(e)}")
        return {"success": False, "message": f"Response generation failed: {str(e)}"}

@app.get("/api/personality/config")
async def get_personality_config():
    """Get personality configuration"""
    try:
        # Load the personality configuration
        config_path = os.path.join("config", "personality_config.json")
        with open(config_path, "r") as f:
            config = json.load(f)
        return {"success": True, "config": config}
    except Exception as e:
        logger.error(f"Error loading personality config: {str(e)}")
        return {"success": False, "message": f"Failed to load personality config: {str(e)}"}

@app.post("/api/personality/update")
async def update_personality(update_request: PersonalityUpdateRequest):
    """Update personality traits"""
    try:
        await personality_engine.update_personality(update_request.dict(exclude_none=True))
        return {"success": True, "message": "Personality updated successfully"}
    except Exception as e:
        logger.error(f"Error updating personality: {str(e)}")
        return {"success": False, "message": f"Personality update failed: {str(e)}"}

@app.get("/api/personality/stats")
async def get_personality_stats():
    """Get personality statistics"""
    try:
        stats = await personality_engine.get_personality_stats()
        return {"success": True, "stats": stats}
    except Exception as e:
        logger.error(f"Error getting personality stats: {str(e)}")
        return {"success": False, "message": f"Failed to get personality stats: {str(e)}"}

@app.post("/api/content/create")
async def create_content(content_request: ContentRequest):
    """Generate new content"""
    try:
        params = {
            "topic": content_request.topic,
            "tone": content_request.tone,
            "word_count": content_request.word_count
        }
        content = await content_manager.generate_content(
            content_request.content_type, 
            params
        )
        return {"success": True, "content": content}
    except Exception as e:
        logger.error(f"Error creating content: {str(e)}")
        return {"success": False, "message": f"Content creation failed: {str(e)}"}

@app.post("/api/content/schedule")
async def schedule_content(content: Dict = Body(...), publish_time: Optional[str] = None):
    """Schedule content for publishing"""
    try:
        scheduled = await content_manager.schedule_content(content, publish_time)
        return {"success": True, "scheduled_content": scheduled}
    except Exception as e:
        logger.error(f"Error scheduling content: {str(e)}")
        return {"success": False, "message": f"Content scheduling failed: {str(e)}"}

@app.post("/api/engagement/interact")
async def handle_interaction(interaction: InteractionRequest):
    """Process user interaction"""
    try:
        response = await engagement_system.process_interaction(interaction.dict())
        return {"success": True, "response": response}
    except Exception as e:
        logger.error(f"Error processing interaction: {str(e)}")
        return {"success": False, "message": f"Interaction processing failed: {str(e)}"}

@app.get("/api/engagement/stats")
async def get_engagement_stats():
    """Get engagement statistics"""
    try:
        stats = await engagement_system.get_engagement_stats()
        return {"success": True, "stats": stats}
    except Exception as e:
        logger.error(f"Error getting engagement stats: {str(e)}")
        return {"success": False, "message": f"Failed to get engagement stats: {str(e)}"}

if __name__ == "__main__":
    config = load_config().get("system", {})
    host = config.get("api", {}).get("host", "localhost")
    port = int(config.get("api", {}).get("port", 8000))
    
    logger.info(f"Starting NSFW Influencer Engine API on {host}:{port}")
    uvicorn.run("main:app", host=host, port=port, reload=True)

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