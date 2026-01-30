
export interface SystemNode {
  id: string;
  label: string;
  type: 'database' | 'service' | 'api' | 'queue' | 'ai-layer';
  status: 'healthy' | 'bottleneck' | 'legacy' | 'unoptimized';
  details: string;
  pos: { x: number; y: number };
}

export interface SystemLink {
  source: string;
  target: string;
  latency: number;
  type: 'sync' | 'async' | 'legacy';
}

export interface OptimizationProposal {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  type: 'refactor' | 'migration' | 'consolidation' | 'ai-prep';
  codeBefore?: string;
  codeAfter?: string;
  status: 'pending' | 'simulating' | 'applied';
}

export interface AnalysisReport {
  score: number;
  healthBreakdown: {
    scalability: number;
    maintainability: number;
    aiReadiness: number;
    efficiency: number;
  };
  bottlenecks: string[];
}
