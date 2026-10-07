from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class Position(BaseModel):
    x: float
    y: float

class AgentData(BaseModel):
    role: str
    model: str
    systemPrompt: str
    tools: List[str]
    hourlyRate: float
    status: str = "idle"

class NodeSchema(BaseModel):
    id: str
    type: str
    position: Position
    data: AgentData

class EdgeSchema(BaseModel):
    id: str
    source: str
    target: str

class WorkflowPayload(BaseModel):
    nodes: List[NodeSchema]
    edges: List[EdgeSchema]
