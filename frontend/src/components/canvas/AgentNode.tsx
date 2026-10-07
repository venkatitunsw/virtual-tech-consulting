import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { AgentData } from '../../store/canvasStore';

export function AgentNode({ data, selected }: NodeProps<AgentData>) {
  return (
    <div className={`p-4 rounded-xl border bg-white shadow-md w-64 ${selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-blue-400" />
      
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800 text-sm truncate">{data.role}</h3>
          <span className={`w-3 h-3 rounded-full ${
            data.status === 'running' ? 'bg-yellow-400 animate-pulse' : 
            data.status === 'completed' ? 'bg-green-400' : 'bg-gray-300'
          }`}></span>
        </div>
        
        <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
          Model: {data.model}
        </div>
        
        <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-100">
          <span className="text-xs font-medium text-gray-600">${data.hourlyRate}/hr</span>
          <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
            {data.tools.length} Tools
          </span>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-blue-400" />
    </div>
  );
}
