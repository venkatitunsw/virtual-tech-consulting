from typing import TypedDict, Annotated, Sequence
import operator
from langchain_core.messages import BaseMessage
from langgraph.graph import StateGraph, END
from app.models.schemas import WorkflowPayload
from litellm import completion
import os

# Define the global state for the execution graph
class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], operator.add]
    current_task: str
    budget_spent: float

class WorkflowEngine:
    def __init__(self, payload: WorkflowPayload):
        self.payload = payload
        self.graph_builder = StateGraph(AgentState)
        self.compile_graph()

    def compile_graph(self):
        # 1. Map Frontend Nodes to LangGraph Node Functions
        for node in self.payload.nodes:
            node_id = node.id
            agent_data = node.data
            
            # Create a closure for the agent's execution logic
            def agent_node_func(state: AgentState, agent_config=agent_data):
                # Using LiteLLM to route to Ollama or vLLM based on the canvas model
                response = completion(
                    model=f"ollama/{agent_config.model}", # Standardized proxy
                    messages=[
                        {"role": "system", "content": agent_config.systemPrompt},
                        {"role": "user", "content": state["current_task"]}
                    ],
                    api_base="http://localhost:11434" # Ollama local proxy default
                )
                
                # Mock calculation of cost based on hourly rate
                added_cost = agent_config.hourlyRate * 0.05 
                
                return {
                    "messages": [response.choices[0].message],
                    "budget_spent": state.get("budget_spent", 0.0) + added_cost
                }
                
            self.graph_builder.add_node(node_id, agent_node_func)
            
        # 2. Map Frontend Edges to LangGraph Edges
        for edge in self.payload.edges:
            self.graph_builder.add_edge(edge.source, edge.target)
            
        # 3. Set Entry Point
        if self.payload.nodes:
            self.graph_builder.set_entry_point(self.payload.nodes[0].id)
            
        # Compile
        self.executable_graph = self.graph_builder.compile()

    async def execute_stream(self, initial_state: AgentState):
        """Yields execution events for the WebSocket"""
        async for event in self.executable_graph.astream_events(initial_state, version="v1"):
            yield event
