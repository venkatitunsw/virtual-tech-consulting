from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from app.models.schemas import WorkflowPayload
import asyncio
import json

app = FastAPI(title="Virtual Tech Consulting API")

# Allow requests from Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/v1/workflows/compile")
async def compile_workflow(payload: WorkflowPayload):
    # Here we would map the payload to a LangGraph instance
    # For now, return success
    return {
        "status": "success", 
        "message": "Workflow compiled",
        "node_count": len(payload.nodes),
        "edge_count": len(payload.edges)
    }

@app.websocket("/ws/execute")
async def execute_workflow(websocket: WebSocket):
    await websocket.accept()
    try:
        # Mocking an execution stream
        data = await websocket.receive_text()
        workflow = json.loads(data)
        
        for node in workflow.get("nodes", []):
            # Stream status update
            await websocket.send_json({
                "type": "status_update",
                "node_id": node["id"],
                "status": "running"
            })
            await asyncio.sleep(2) # Mock execution time
            
            await websocket.send_json({
                "type": "log",
                "node_id": node["id"],
                "message": f"Agent {node['data']['role']} completed analysis using {node['data']['model']}."
            })
            
            await websocket.send_json({
                "type": "status_update",
                "node_id": node["id"],
                "status": "completed"
            })
            await asyncio.sleep(1)
            
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        await websocket.close()
