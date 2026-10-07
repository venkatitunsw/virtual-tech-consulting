import React, { useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useCanvasStore } from './store/canvasStore';
import { AgentNode } from './components/canvas/AgentNode';

const nodeTypes = {
  agentNode: AgentNode,
};

function FlowCanvas() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useCanvasStore();

  return (
    <div className="h-screen w-full flex flex-col">
      {/* Top Navbar */}
      <header className="h-14 border-b bg-white flex items-center justify-between px-6 shadow-sm z-10">
        <div className="font-bold text-lg tracking-tight text-gray-900">Virtual Consulting Platform</div>
        <div className="flex items-center space-x-4">
          <div className="text-sm font-medium bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200">
            Total Budget: $5,000
          </div>
          <button className="px-4 py-1.5 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition">
            Run Workflow
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex relative">
        {/* Left Sidebar (Plugin Manager mock) */}
        <div className="w-64 border-r bg-gray-50 flex flex-col p-4 shadow-inner z-10 hidden sm:flex">
          <h2 className="text-xs font-bold uppercase text-gray-500 mb-4 tracking-wider">Plugin Library</h2>
          
          <div className="space-y-3">
            <div className="p-3 bg-white border rounded-lg cursor-grab hover:border-blue-400 shadow-sm transition">
              <div className="font-medium text-sm">LLaMA 3 (8B)</div>
              <div className="text-xs text-gray-400 mt-1">Local Inference</div>
            </div>
            <div className="p-3 bg-white border rounded-lg cursor-grab hover:border-blue-400 shadow-sm transition">
              <div className="font-medium text-sm">Mistral Nemo</div>
              <div className="text-xs text-gray-400 mt-1">Ollama Model</div>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 h-full relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            className="bg-gray-50"
          >
            <Background color="#e2e8f0" gap={16} />
            <Controls />
            <MiniMap 
              nodeColor={(n) => {
                if (n.type === 'agentNode') return '#3b82f6';
                return '#cbd5e1';
              }} 
            />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  );
}
