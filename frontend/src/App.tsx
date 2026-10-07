import React, { useCallback, useRef, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { v4 as uuidv4 } from 'uuid';

import { useCanvasStore } from './store/canvasStore';
import { AgentNode } from './components/canvas/AgentNode';

const nodeTypes = {
  agentNode: AgentNode,
};

function FlowCanvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode } = useCanvasStore();
  const { screenToFlowPosition } = useReactFlow();

  const onDragStart = (event: React.DragEvent, nodeType: string, role: string, model: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('role', role);
    event.dataTransfer.setData('model', model);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      const role = event.dataTransfer.getData('role');
      const model = event.dataTransfer.getData('model');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: `agent-${uuidv4()}`,
        type,
        position,
        data: { 
          role: role, 
          model: model, 
          systemPrompt: 'You are a helpful AI assistant.', 
          tools: [], 
          hourlyRate: 50.0, 
          status: 'idle' 
        },
      };

      addNode(newNode as any);
    },
    [screenToFlowPosition, addNode],
  );

  return (
    <div className="h-screen w-full flex flex-col font-sans bg-[#0e1117] text-gray-100">
      {/* Top Navbar */}
      <header className="h-16 border-b border-gray-800 bg-[#161b22] flex items-center justify-between px-6 shadow-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/20">
            AI
          </div>
          <div className="font-semibold text-lg tracking-wide text-gray-200">Paperclip Orchestrator</div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm font-medium bg-emerald-900/40 text-emerald-400 px-4 py-1.5 rounded-full border border-emerald-800/50 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            Budget: $5,000.00
          </div>
          <button className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg shadow-lg shadow-indigo-500/30 transition-all active:scale-95 border border-indigo-400/20">
            Deploy Workflow
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-72 border-r border-gray-800 bg-[#161b22] flex flex-col shadow-2xl z-10 hidden sm:flex">
          <div className="p-5 border-b border-gray-800">
            <h2 className="text-xs font-bold uppercase text-gray-400 tracking-widest mb-1">Components</h2>
            <p className="text-xs text-gray-500">Drag nodes to build your team</p>
          </div>
          
          <div className="p-4 space-y-4 overflow-y-auto">
            {/* Agent Models */}
            <div>
              <h3 className="text-xs font-semibold text-indigo-400 mb-3 ml-1 uppercase tracking-wider">Agents & Models</h3>
              <div className="space-y-3">
                <div 
                  onDragStart={(event) => onDragStart(event, 'agentNode', 'Senior Architect', 'llama3:8b')}
                  draggable
                  className="p-3 bg-[#0d1117] border border-gray-700/50 rounded-xl cursor-grab active:cursor-grabbing hover:border-indigo-500/50 hover:bg-indigo-900/10 transition-all group shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div className="font-semibold text-sm text-gray-200 group-hover:text-indigo-300 transition-colors">Senior Architect</div>
                    <div className="text-[10px] px-2 py-0.5 rounded-md bg-gray-800 text-gray-400 border border-gray-700">Llama 3</div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2 line-clamp-1">System design & strategy</div>
                </div>

                <div 
                  onDragStart={(event) => onDragStart(event, 'agentNode', 'Data Scientist', 'mistral:nemo')}
                  draggable
                  className="p-3 bg-[#0d1117] border border-gray-700/50 rounded-xl cursor-grab active:cursor-grabbing hover:border-purple-500/50 hover:bg-purple-900/10 transition-all group shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div className="font-semibold text-sm text-gray-200 group-hover:text-purple-300 transition-colors">Data Scientist</div>
                    <div className="text-[10px] px-2 py-0.5 rounded-md bg-gray-800 text-gray-400 border border-gray-700">Mistral</div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2 line-clamp-1">Data analysis & python execution</div>
                </div>
              </div>
            </div>

            {/* Tools */}
            <div className="pt-4 border-t border-gray-800/50">
              <h3 className="text-xs font-semibold text-emerald-400 mb-3 ml-1 uppercase tracking-wider">Capabilities</h3>
              <div className="space-y-3">
                <div 
                  className="p-3 bg-[#0d1117] border border-gray-700/50 rounded-xl cursor-not-allowed opacity-50"
                  title="Coming soon"
                >
                  <div className="font-semibold text-sm text-gray-400">Web Search API</div>
                  <div className="text-xs text-gray-600 mt-1">Tool Node</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 h-full relative" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
            className="bg-[#0e1117]"
          >
            <Background color="#30363d" gap={16} size={1} />
            <Controls className="bg-gray-800 border-gray-700 fill-gray-300" />
            <MiniMap 
              nodeColor={(n) => '#373e47'} 
              maskColor="rgba(14, 17, 23, 0.7)"
              className="bg-[#161b22] border-gray-800"
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
