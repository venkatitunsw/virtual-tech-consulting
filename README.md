# Virtual Tech Consulting Platform

A standalone, drag-and-drop multi-agent orchestration platform structured as a virtual tech consulting company. Build complex AI workflows by visually connecting specialized agents and open-source models on a unified canvas.

## Features

* **Drag-and-Drop Canvas:** Powered by React Flow, easily map out organizational structures and agent communication pipelines.
* **Agent Nodes:** Configure agent roles, assign local open-source models (Llama 3, Mistral, etc.), and define system prompts.
* **Cost Tracking:** Real-time budget simulation based on assigned hourly rates for each agent node.
* **Local Inference:** Integrated with LiteLLM to support any OpenAI-compatible local model server (Ollama, vLLM, llama.cpp).
* **Sandboxed Tools (WIP):** Secure execution of code and plugins via Podman/Docker.
* **Exportable Workflows:** Save and share your multi-agent architecture as standard JSON payloads.

## Tech Stack

* **Frontend:** React, TypeScript, Vite, React Flow, Zustand, Tailwind CSS, shadcn/ui
* **Backend:** FastAPI, Python, Pydantic, LangGraph, LiteLLM

## Prerequisites

* [Node.js](https://nodejs.org/) (v18+)
* [Python](https://www.python.org/) (3.10+)
* [Ollama](https://ollama.com/) (for local model inference)

## Installation

### 1. Backend Setup

```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

## Running the Platform Locally

You will need two terminal windows to run both servers simultaneously.

**Terminal 1: FastAPI Backend**
```bash
cd backend
.\venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

**Terminal 2: Vite Frontend**
```bash
cd frontend
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

## Architecture Overview

The system operates using a strict JSON state isomorphism between the Frontend Control Plane and the Backend Execution Engine.

1. **Frontend (Canvas):** Users define `AgentNodes` and connect them via edges. Zustand manages the live state of the graph.
2. **Serialization:** The graph is serialized into a JSON `WorkflowPayload` and sent to the FastAPI backend.
3. **Compilation:** The backend maps the nodes into a `LangGraph.StateGraph`, generating dynamic execution routing.
4. **Execution & Streaming:** `LiteLLM` routes inference to local models (e.g., Ollama). Agent states, logs, and token usage are streamed back to the frontend canvas via WebSockets.

## License
MIT License
