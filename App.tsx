
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Activity, 
  Cpu, 
  Database, 
  Layers, 
  AlertTriangle, 
  Zap, 
  ArrowRight, 
  Terminal, 
  CheckCircle2, 
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Code
} from 'lucide-react';
import ArchitectureGraph from './components/ArchitectureGraph';
import MetricsPanel from './components/MetricsPanel';
import { INITIAL_NODES, INITIAL_LINKS } from './constants';
import { SystemNode, SystemLink, OptimizationProposal, AnalysisReport } from './types';
import { analyzeArchitecture } from './services/geminiService';

const App: React.FC = () => {
  const [nodes, setNodes] = useState<SystemNode[]>(INITIAL_NODES);
  const [links, setLinks] = useState<SystemLink[]>(INITIAL_LINKS);
  const [proposals, setProposals] = useState<OptimizationProposal[]>([]);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [logs, setLogs] = useState<string[]>(["[SYSTEM] Initialization complete.", "[AGENT] Awaiting system analysis..."]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'proposals' | 'simulation'>('dashboard');

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 49)]);
  };

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    addLog("Starting full system deep scan...");
    addLog("Extracting DB schemas and API signatures...");
    
    try {
      const result = await analyzeArchitecture(nodes, links);
      setReport({
        score: result.score,
        healthBreakdown: result.healthBreakdown,
        bottlenecks: result.proposals.map((p: any) => p.title)
      });
      setProposals(result.proposals.map((p: any) => ({ ...p, status: 'pending' })));
      addLog(`Analysis complete. System Health Score: ${result.score}%`);
      addLog(`Detected ${result.proposals.length} critical architectural improvements.`);
    } catch (error) {
      addLog(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applyProposal = (id: string) => {
    setProposals(prev => prev.map(p => p.id === id ? { ...p, status: 'simulating' } : p));
    addLog(`Simulating impact for proposal ${id}...`);
    
    setTimeout(() => {
      setProposals(prev => prev.map(p => p.id === id ? { ...p, status: 'applied' } : p));
      addLog(`Refactoring successfully deployed to staging for ${id}.`);
      
      // Update dummy state to reflect "applied" changes
      if (id.includes('db') || id.toLowerCase().includes('database')) {
        setNodes(nodes.map(n => n.id === 'n3' ? { ...n, status: 'healthy' } : n));
      }
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#030712] flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Cpu className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">ArchOptimizer AI</h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Autonomous Architecture Rewriter</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                isAnalyzing ? 'bg-gray-800 text-gray-500' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
              }`}
            >
              {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              {isAnalyzing ? 'Analyzing System...' : 'Start Full Analysis'}
            </button>
            <div className="w-px h-8 bg-gray-800 hidden md:block" />
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Stats & Graph */}
        <div className="flex-1 space-y-8">
          
          {/* Dashboard Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Health Score', value: report ? `${report.score}%` : '---', icon: Activity, color: 'text-green-500' },
              { label: 'AI Readiness', value: report ? `${report.healthBreakdown.aiReadiness}%` : '---', icon: Zap, color: 'text-purple-500' },
              { label: 'Bottlenecks', value: nodes.filter(n => n.status === 'bottleneck').length, icon: AlertTriangle, color: 'text-red-500' },
              { label: 'Services', value: nodes.length, icon: Layers, color: 'text-blue-500' },
            ].map((stat, i) => (
              <div key={i} className="bg-gray-900/40 p-4 rounded-xl border border-gray-800 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  <span className="text-[10px] text-gray-500 font-mono">LIVE</span>
                </div>
                <span className="text-2xl font-bold">{stat.value}</span>
                <span className="text-xs text-gray-500 mt-1">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-800 flex gap-8">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'dashboard' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              System Map
              {activeTab === 'dashboard' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />}
            </button>
            <button 
              onClick={() => setActiveTab('proposals')}
              className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'proposals' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Optimizations {proposals.length > 0 && <span className="ml-2 px-2 py-0.5 bg-indigo-900/50 text-indigo-400 rounded-full text-[10px]">{proposals.length}</span>}
              {activeTab === 'proposals' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />}
            </button>
          </div>

          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <ArchitectureGraph nodes={nodes} links={links} />
              <MetricsPanel />
            </div>
          )}

          {activeTab === 'proposals' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              {proposals.length === 0 ? (
                <div className="bg-gray-900/20 border border-dashed border-gray-800 rounded-xl p-12 text-center">
                  <Layers className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                  <h3 className="text-gray-400 font-semibold">No Proposals Yet</h3>
                  <p className="text-gray-600 text-sm mt-1">Run an analysis to generate architectural improvements.</p>
                </div>
              ) : (
                proposals.map((prop) => (
                  <div key={prop.id} className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${prop.type === 'ai-prep' ? 'bg-purple-900/30 text-purple-400' : 'bg-indigo-900/30 text-indigo-400'}`}>
                            {prop.type === 'ai-prep' ? <Zap className="w-5 h-5" /> : <Code className="w-5 h-5" />}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{prop.title}</h3>
                            <div className="flex gap-2 mt-1">
                              <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider ${
                                prop.impact === 'high' ? 'bg-red-900/30 text-red-400' : 'bg-yellow-900/30 text-yellow-400'
                              }`}>{prop.impact} IMPACT</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 uppercase font-bold tracking-wider">{prop.type}</span>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => applyProposal(prop.id)}
                          disabled={prop.status !== 'pending'}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${
                            prop.status === 'applied' ? 'bg-green-900/30 text-green-400 cursor-default' :
                            prop.status === 'simulating' ? 'bg-gray-800 text-gray-500 cursor-wait' :
                            'bg-indigo-600 hover:bg-indigo-500 text-white'
                          }`}
                        >
                          {prop.status === 'applied' ? <CheckCircle2 className="w-4 h-4" /> : 
                           prop.status === 'simulating' ? <RefreshCw className="w-4 h-4 animate-spin" /> : 
                           <ArrowRight className="w-4 h-4" />}
                          {prop.status === 'applied' ? 'Deployed to Staging' : prop.status === 'simulating' ? 'Simulating...' : 'Apply Refactor'}
                        </button>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed mb-6">{prop.description}</p>
                      
                      {(prop.codeBefore || prop.codeAfter) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-black/40 rounded-lg p-4 border border-gray-800">
                            <span className="text-[10px] text-gray-500 font-mono block mb-2">BEFORE (LEGACY)</span>
                            <pre className="text-xs font-mono text-gray-400 overflow-x-auto">
                              <code>{prop.codeBefore || '// legacy implementation...'}</code>
                            </pre>
                          </div>
                          <div className="bg-indigo-900/10 rounded-lg p-4 border border-indigo-900/30">
                            <span className="text-[10px] text-indigo-400 font-mono block mb-2">AFTER (OPTIMIZED)</span>
                            <pre className="text-xs font-mono text-indigo-300 overflow-x-auto">
                              <code>{prop.codeAfter || '// new implementation...'}</code>
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Right Column: Console & Feed */}
        <div className="w-full lg:w-80 space-y-6">
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden flex flex-col h-[500px]">
            <div className="bg-gray-800/50 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">Agent Logs</span>
              </div>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse-slow"></div>
            </div>
            <div className="flex-1 p-4 font-mono text-[11px] overflow-y-auto space-y-2">
              {logs.map((log, i) => (
                <div key={i} className={`${i === 0 ? 'text-indigo-400' : 'text-gray-500'} leading-relaxed`}>
                  {log}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-indigo-900/20 p-6 rounded-xl border border-indigo-500/20 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <ShieldCheck className="w-32 h-32 text-indigo-400" />
            </div>
            <h4 className="text-indigo-300 font-bold mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Safety Check Active
            </h4>
            <p className="text-xs text-indigo-200/70 leading-relaxed">
              Autonomous changes are currently restricted to the <b>Staging/Sandbox</b> environment. Approval required for Production deployment.
            </p>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">© 2024 ArchOptimizer AI. Autonomous Architectural Engineering.</p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-gray-400 hover:text-white transition-colors">Documentation</a>
            <a href="#" className="text-xs text-gray-400 hover:text-white transition-colors">API Specs</a>
            <a href="#" className="text-xs text-gray-400 hover:text-white transition-colors">Security Audit</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
