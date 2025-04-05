# main.py
from fastapi import FastAPI, Request, Body
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from datetime import datetime
from typing import Dict, Any, Optional
import logging
import os
from dotenv import load_dotenv

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("app.log"),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()
openai_key = os.getenv("OPENAI_API_KEY")
print(f"OpenAI Key loaded: {openai_key is not None}")
if openai_key:
    print(f"First few characters of key if present: {openai_key[:5]}...")

# Import core components
from src.core.engagement import EngagementSystem
from src.core.personality import PersonalityEngine
from src.core.content_manager import ContentManager
from src.utils.database import DatabaseManager # Import DatabaseManager

# Initialize components
engagement_system = EngagementSystem()
personality_engine = PersonalityEngine()
content_manager = ContentManager()
db_manager = DatabaseManager() # Initialize DatabaseManager

# Initialize FastAPI app
app = FastAPI(
    title="NSFW Influencer Engine",
    description="API for AI Influencer Engine",
    version="0.1.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", response_class=HTMLResponse)
async def root():
    """Simple HTML response for the root endpoint"""
    html_content = """
    <!DOCTYPE html>
    <html>
        <head>
            <title>NSFW Influencer Engine</title>
        </head>
        <body>
            <h1>NSFW Influencer Engine API</h1>
            <p>API is running correctly!</p>
            <p>Try the <a href="/health">/health</a> endpoint to check the API status.</p>
            <p>Admin dashboard is available at <a href="http://localhost:3000">http://localhost:3000</a></p>
        </body>
    </html>
    """
    return HTMLResponse(content=html_content)

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.get("/test")
async def test():
    """Test endpoint"""
    return {"message": "Test endpoint working", "timestamp": datetime.now().isoformat()}

# Engagement API endpoints
@app.post("/api/engagement/interact")
async def process_interaction(interaction_data: Dict[str, Any] = Body(...)):
    """Process a user interaction and generate a response"""
    try:
        logger.info(f"Received interaction: {interaction_data}")
        result = await engagement_system.process_interaction(interaction_data)
        return {
            "success": True,
            "response": result["response"],
            "processed_at": result["processed_at"]
        }
    except Exception as e:
        logger.error(f"Error processing interaction: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": f"Error processing interaction: {str(e)}"}
        )

@app.get("/api/engagement/stats")
async def get_engagement_stats():
    """Get current engagement statistics"""
    try:
        stats = await engagement_system.get_engagement_stats()
        return {"success": True, "stats": stats}
    except Exception as e:
        logger.error(f"Error getting engagement stats: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": f"Error getting stats: {str(e)}"}
        )

@app.get("/api/engagement/recent")
async def get_recent_interactions(limit: int = 10):
    """Get recent interactions history"""
    try:
        interactions = await engagement_system.get_recent_interactions(limit)
        return {"success": True, "interactions": interactions}
    except Exception as e:
        logger.error(f"Error getting recent interactions: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": f"Error getting recent interactions: {str(e)}"}
        )

# Content Generation API endpoints
@app.post("/api/content/create")
async def create_content(content_data: Dict[str, Any] = Body(...)):
    """Generate content based on provided parameters"""
    try:
        logger.info(f"Content generation request: {content_data}")
        
        content_type = content_data.get("content_type", "post")
        topic = content_data.get("topic", "general")
        tone = content_data.get("tone", "casual")
        word_count = content_data.get("word_count", 150)
        
        # Prepare params for content generation
        params = {
            "topic": topic,
            "tone": tone,
            "word_count": word_count
        }
        
        logger.info(f"Calling content_manager.generate_content with: {content_type}, {params}")
        result = await content_manager.generate_content(content_type, params)
        logger.info(f"Content generation result: {result}")
        
        return {
            "success": True,
            "content": result["text"],
            "created_at": result["created_at"]
        }
    except Exception as e:
        logger.error(f"Error generating content: {str(e)}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": f"Error generating content: {str(e)}"}
        )

@app.post("/api/content/schedule")
async def schedule_content(schedule_data: Dict[str, Any] = Body(...)):
    """Schedule content for publishing"""
    try:
        content = schedule_data.get("content", {})
        publish_time = schedule_data.get("publish_time")
        
        result = await content_manager.schedule_content(content, publish_time)
        
        return {
            "success": True,
            "scheduled_content": result
        }
    except Exception as e:
        logger.error(f"Error scheduling content: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": f"Error scheduling content: {str(e)}"}
        )

@app.post("/api/content/save")
async def save_content_to_library(content_data: Dict[str, Any] = Body(...)):
    """Save generated content to the database library"""
    try:
        logger.info(f"Saving content to library: {content_data}")
        
        # Add a timestamp
        content_data_with_timestamp = {
            **content_data,
            "saved_at": datetime.now().isoformat(),
            "status": "saved" # Add a status
        }
        
        # Use the DatabaseManager instance to store content
        inserted_id = db_manager.store_content(content_data_with_timestamp)
        
        logger.info(f"Content saved with ID: {inserted_id}")
        return {
            "success": True,
            "message": "Content saved successfully",
            "content_id": inserted_id
        }
    except Exception as e:
        logger.error(f"Error saving content to library: {str(e)}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": f"Error saving content: {str(e)}"}
        )

# Personality API endpoints
@app.get("/api/personality/config")
async def get_personality_config():
    """Get current personality configuration"""
    try:
        logger.info("Received request for personality config")
        config = await personality_engine.get_personality_stats()
        logger.info(f"Retrieved personality config: {config}")
        return {
            "success": True,
            "config": config
        }
    except Exception as e:
        logger.error(f"Error getting personality config: {str(e)}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")
        return JSONResponse(
            status_code=500, 
            content={"success": False, "message": f"Error getting personality config: {str(e)}"}
        )

@app.post("/api/personality/update")
async def update_personality(traits_data: Dict[str, Any] = Body(...)):
    """Update personality traits"""
    try:
        logger.info(f"Updating personality with: {traits_data}")
        await personality_engine.update_personality(traits_data)
        
        return {
            "success": True,
            "message": "Personality updated successfully"
        }
    except Exception as e:
        logger.error(f"Error updating personality: {str(e)}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": f"Error updating personality: {str(e)}"}
        )

@app.post("/api/personality/generate")
async def generate_personality_response(prompt_data: Dict[str, Any] = Body(...)):
    """Generate a response with current personality settings"""
    try:
        logger.info(f"Generating personality response with: {prompt_data}")
        prompt = prompt_data.get("prompt", "")
        context = prompt_data.get("context", {})
        
        response = await personality_engine.generate_response(prompt, context)
        logger.info(f"Generated response: {response[:50]}...")
        
        return {
            "success": True,
            "response": response
        }
    except Exception as e:
        logger.error(f"Error generating personality response: {str(e)}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": f"Error generating personality response: {str(e)}"}
        )

# System Settings API endpoints
@app.get("/api/settings")
async def get_system_settings():
    """Get current system settings"""
    try:
        logger.info("Retrieving system settings")
        
        # Load system config
        from src.utils.config import load_config
        system_config = load_config().get("system", {})
        
        # Format settings for the frontend
        settings = {
            "openaiApiKey": "sk-***************", # Don't send actual key, just a placeholder
            "mongoDbUri": system_config.get("database", {}).get("uri", ""),
            "postGenerationLimit": 10,
            "responseTime": {
                "comments": 5,
                "directMessages": 10
            },
            "backupFrequency": "daily",
            "enableNotifications": True
        }
        
        logger.info("Successfully retrieved system settings")
        return {
            "success": True,
            "settings": settings
        }
    except Exception as e:
        logger.error(f"Error retrieving system settings: {str(e)}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": f"Error retrieving system settings: {str(e)}"}
        )

@app.post("/api/settings")
async def update_system_settings(settings_data: Dict[str, Any] = Body(...)):
    """Update system settings"""
    try:
        logger.info(f"Updating system settings: {settings_data}")
        
        # Here you would update system config
        # For now, just return success
        
        logger.info("Successfully updated system settings")
        return {
            "success": True,
            "message": "Settings updated successfully"
        }
    except Exception as e:
        logger.error(f"Error updating system settings: {str(e)}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": f"Error updating system settings: {str(e)}"}
        )

@app.post("/api/test-connection")
async def test_connection(connection_data: Dict[str, Any] = Body(...)):
    """Test connection to a service"""
    try:
        service = connection_data.get("service", "")
        logger.info(f"Testing connection to {service}")
        
        if service == "mongodb":
            # Here you would test the MongoDB connection
            # For now, just return success
            return {"success": True}
        elif service == "openai":
            # Here you would test the OpenAI connection
            # For now, just return success
            return {"success": True}
        else:
            return JSONResponse(
                status_code=400,
                content={"success": False, "message": f"Unknown service: {service}"}
            )
    except Exception as e:
        logger.error(f"Error testing connection to {connection_data.get('service')}: {str(e)}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": f"Error testing connection: {str(e)}"}
        )

if __name__ == "__main__":
    logger.info("Starting API server...")
    uvicorn.run("main:app", host="127.0.0.1", port=8080, log_level="info")
