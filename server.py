from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from typing import List, Optional, Dict
import httpx
import json
from datetime import datetime
from sse_starlette.sse import EventSourceResponse

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ollama API configuration
OLLAMA_API_URL = "http://localhost:11434"
OLLAMA_MODEL = "llama3.2"

# Chat with Ollama LLM
async def stream_ollama_response(messages, system_prompt=None, temperature=0.7, max_tokens=2000):
    # Prepare the request payload
    payload = {
        "model": OLLAMA_MODEL,
        "messages": messages,
        "stream": True,
        "options": {
            "temperature": temperature,
            "num_predict": max_tokens
        }
    }
    
    if system_prompt:
        payload["system"] = system_prompt
    
    async with httpx.AsyncClient() as client:
        async with client.stream("POST", f"{OLLAMA_API_URL}/api/chat", json=payload, timeout=60.0) as response:
            if response.status_code != 200:
                error_detail = await response.aread()
                raise HTTPException(status_code=response.status_code, detail=f"Ollama API error: {error_detail}")
            
            async for chunk in response.aiter_bytes():
                if chunk:
                    try:
                        data = json.loads(chunk)
                        if "message" in data and "content" in data["message"]:
                            yield f"data: {json.dumps({'text': data['message']['content']})}\n\n"
                    except json.JSONDecodeError:
                        continue
            
            yield f"data: [DONE]\n\n"

@app.post("/api/chat")
async def chat_with_llm(request: Dict):
    messages = request.get("messages", [])
    system_prompt = request.get("systemPrompt") or """You are a helpful healthcare assistant. 
    
    Guidelines:
    - Provide general health information and guidance
    - Do not provide specific medical diagnoses or treatment plans
    - Always recommend consulting with a healthcare professional for specific medical concerns
    - Be empathetic and supportive
    - Provide evidence-based information when possible
    - Clearly state when you don't know something
    - Focus on general wellness advice and educational information
    - Maintain user privacy and confidentiality"""
    
    return StreamingResponse(
        stream_ollama_response(
            messages, 
            system_prompt=system_prompt,
            temperature=request.get("temperature", 0.7),
            max_tokens=request.get("max_tokens", 2000)
        ),
        media_type="text/event-stream"
    )

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.get("/api/ollama-status")
async def check_ollama_status():
    """Check if Ollama service is available and running."""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{OLLAMA_API_URL}/api/version", timeout=3.0)
            
            if response.status_code == 200:
                data = response.json()
                return {
                    "status": "online",
                    "message": "Ollama service is running",
                    "version": data.get("version", "unknown"),
                    "model": OLLAMA_MODEL
                }
            else:
                return {
                    "status": "offline",
                    "message": f"Ollama service returned status code {response.status_code}"
                }
    except Exception as e:
        return {
            "status": "offline",
            "message": f"Failed to connect to Ollama service: {str(e)}"
        }

# Run the server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)

