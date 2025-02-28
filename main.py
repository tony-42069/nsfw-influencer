# main.py
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from datetime import datetime

# Initialize FastAPI app
app = FastAPI(
    title="NSFW Influencer Engine",
    description="API Debugging Version",
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

if __name__ == "__main__":
    print("Starting simplified API server...")
    uvicorn.run("main:app", host="127.0.0.1", port=8000, log_level="info")