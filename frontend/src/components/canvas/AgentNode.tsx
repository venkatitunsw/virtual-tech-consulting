import React from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import type { AgentNode as AgentNodeType } from '../../store/canvasStore';

export function AgentNode({ data, selected }: NodeProps<AgentNodeType>) {
  return (
    <div className={`relative group w-72 rounded-2xl border bg-[#161b22] shadow-2xl transition-all duration-200 
      ${selected ? 'border-indigo-500 shadow-indigo-500/20 shadow-2xl scale-[1.02]' : 'border-gray-700 hover:border-gray-600'}`}>
      
      {/* Node Header Glow (based on status) */}
      <div className={`absolute -top-px left-4 right-4 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 transition-opacity duration-500
        ${selected ? 'opacity-100' : 'group-hover:opacity-50'}`}></div>

      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-4 h-4 bg-[#161b22] border-2 border-indigo-500 rounded-md -top-2 transition-transform hover:scale-125 hover:bg-indigo-500" 
      />
      
      <div className="flex flex-col p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-bold text-gray-100 text-base">{data.role}</h3>
            <div className="text-xs font-medium text-indigo-400 mt-0.5 uppercase tracking-wide">
              {data.model}
            </div>
          </div>
          
          {/* Status Indicator */}
          <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-800/50 rounded-md border border-gray-700/50">
            <span className={`w-2 h-2 rounded-full shadow-sm
              ${data.status === 'running' ? 'bg-yellow-400 animate-pulse shadow-yellow-400/50' : 
                data.status === 'completed' ? 'bg-emerald-400 shadow-emerald-400/50' : 'bg-gray-500'
              }`}></span>
            <span className="text-[10px] font-medium text-gray-400 capitalize">{data.status}</span>
          </div>
        </div>
        
        {/* System Prompt Preview */}
        <div className="text-xs text-gray-400 bg-[#0d1117] px-3 py-2.5 rounded-lg border border-gray-800 line-clamp-2 leading-relaxed">
          {data.systemPrompt}
        </div>
        
        {/* Footer Stats */}
        <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-800">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-0.5">Rate</span>
            <span className="text-xs font-medium text-gray-300">${data.hourlyRate.toFixed(2)}/hr</span>
          </div>
          
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-0.5">Capabilities</span>
            <span className="text-xs px-2 py-0.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-md font-medium">
              {data.tools.length} Tools
            </span>
          </div>
        </div>
      </div>

      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-4 h-4 bg-[#161b22] border-2 border-indigo-500 rounded-md -bottom-2 transition-transform hover:scale-125 hover:bg-indigo-500" 
      />
    </div>
  );
}
