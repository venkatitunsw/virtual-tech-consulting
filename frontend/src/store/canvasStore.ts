import { create } from 'zustand';
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';

export type AgentData = {
  role: string;
  model: string;
  systemPrompt: string;
  tools: string[];
  hourlyRate: number;
  status: 'idle' | 'running' | 'completed' | 'error';
};

export type AgentNode = Node<AgentData, 'agentNode'>;

type CanvasState = {
  nodes: AgentNode[];
  edges: Edge[];
  onNodesChange: OnNodesChange<AgentNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (node: AgentNode) => void;
  updateNodeData: (id: string, data: Partial<AgentData>) => void;
};

export const useCanvasStore = create<CanvasState>((set, get) => ({
  nodes: [
    {
      id: 'agent-1',
      type: 'agentNode',
      position: { x: 250, y: 100 },
      data: {
        role: 'Product Manager',
        model: 'llama3:8b-instruct',
        systemPrompt: 'You are a PM. Outline requirements.',
        tools: ['web_search'],
        hourlyRate: 65.0,
        status: 'idle',
      },
    },
  ],
  edges: [],
  onNodesChange: (changes: NodeChange<AgentNode>[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },
  addNode: (node: AgentNode) => {
    set({ nodes: [...get().nodes, node] });
  },
  updateNodeData: (id: string, data: Partial<AgentData>) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, ...data } };
        }
        return node;
      }),
    });
  },
}));
