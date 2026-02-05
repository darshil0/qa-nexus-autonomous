import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  ClipboardCheck, 
  FileEdit, 
  PlayCircle, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  LayoutDashboard,
  BrainCircuit,
  ChevronRight,
  RefreshCw,
  Plus, 
  ExternalLink,
  Search,
  Hash,
  ArrowUpRight,
  X,
  Link as LinkIcon,
  Activity,
  Terminal,
  BarChart3,
  Github,
  Database,
  CloudLightning,
  Workflow,
  ArrowRight,
  Map as MapIcon,
  Circle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  WorkflowStatus, 
  WorkflowState, 
  TestCase,
  ExecutionResult
} from './types';
import { 
  reviewRequirements, 
  generateTestCases, 
  executeTests,
  fetchJiraRequirement,
  createGithubIssue
} from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<WorkflowState>({
    status: WorkflowStatus.IDLE,
    rawRequirements: '',
    validatedSpecs: [],
    testCases: [],
    results: [],
    thinkingProcess: 'System ready.',
    jiraIntegration: { connected: true, projectKey: 'QA-AUTO' }
  });

  const [activeTab, setActiveTab] = useState<'orchestrator' | 'agent1' | 'agent2' | 'agent3' | 'reports'>('orchestrator');
  const [highlightedReqId, setHighlightedReqId] = useState<string | null>(null);
  const [tcSearchTerm, setTcSearchTerm] = useState('');
  const [jiraIssueInput, setJiraIssueInput] = useState('');
  const [isJiraLoading, setIsJiraLoading] = useState(false);
  const [githubCreatingId, setGithubCreatingId] = useState<string | null>(null);

  const runWorkflow = async () => {
    if (!state.rawRequirements.trim()) return;
    try {
      setState(p => ({ ...p, status: WorkflowStatus.AGENT1_REVIEWING, thinkingProcess: '[AGENT 1] Reviewing specs...' }));
      const { specs, thinking: t1 } = await reviewRequirements(state.rawRequirements);
      
      setState(p => ({ ...p, status: WorkflowStatus.AGENT2_WRITING, validatedSpecs: specs, thinkingProcess: `[AGENT 1] ${t1}\n[AGENT 2] Designing tests...` }));
      const { testCases, thinking: t2 } = await generateTestCases(specs);

      setState(p => ({ ...p, status: WorkflowStatus.AGENT3_EXECUTING, testCases, thinkingProcess: `[AGENT 2] ${t2}\n[AGENT 3] Running execution...` }));
      const { results, thinking: t3 } = await executeTests(testCases);

      setState(p => ({ ...p, status: WorkflowStatus.COMPLETED, results, thinkingProcess: `Pipeline complete.\n[AGENT 3] ${t3}` }));
      setActiveTab('reports');
    } catch (err) {
      console.error(err);
      setState(p => ({ ...p, status: WorkflowStatus.FAILED, thinkingProcess: '[ERROR] Workflow aborted.' }));
    }
  };

  const handleJiraFetch = async () => {
    if (!jiraIssueInput.trim()) return;
    setIsJiraLoading(true);
    try {
      const content = await fetchJiraRequirement(jiraIssueInput);
      setState(p => ({ ...p, rawRequirements: (p.rawRequirements ? p.rawRequirements + '\n\n' : '') + content }));
      setJiraIssueInput('');
    } finally {
      setIsJiraLoading(false);
    }
  };

  const handleGithubIssue = async (res: ExecutionResult) => {
    setGithubCreatingId(res.testCaseId);
    try {
      const url = await createGithubIssue(res.testCaseId, res.logs);
      setState(p => ({ ...p, results: p.results.map(r => r.testCaseId === res.testCaseId ? { ...r, githubIssueUrl: url } : r) }));
    } finally {
      setGithubCreatingId(null);
    }
  };

  const navigateToTests = (reqId: string) => {
    setHighlightedReqId(reqId);
    setTcSearchTerm(''); 
    setActiveTab('agent2');
  };

  const navigateToSpec = (reqId: string) => {
    setHighlightedReqId(reqId);
    setActiveTab('agent1');
  };

  const filteredTestCases = useMemo(() => {
    let list = state.testCases;
    if (highlightedReqId) list = list.filter(tc => tc.linkedRequirementIds.includes(highlightedReqId));
    const term = tcSearchTerm.toLowerCase();
    if (term) list = list.filter(tc => tc.id.toLowerCase().includes(term) || tc.category.toLowerCase().includes(term));
    return list;
  }, [state.testCases, tcSearchTerm, highlightedReqId]);

  const testCasesByReq = useMemo(() => {
    const map: Record<string, TestCase[]> = {};
    state.testCases.forEach(tc => {
      tc.linkedRequirementIds.forEach(rid => {
        if (!map[rid]) map[rid] = [];
        map[rid].push(tc);
      });
    });
    return map;
  }, [state.testCases]);

  useEffect(() => {
    if (highlightedReqId) {
      const prefix = activeTab === 'agent1' ? 'spec-' : 'tc-card-';
      const targetId = prefix + (activeTab === 'agent1' ? highlightedReqId : (filteredTestCases[0]?.id || ''));
      const el = document.getElementById(targetId);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    }
  }, [activeTab, highlightedReqId, filteredTestCases]);

  const chartData = useMemo(() => [
    { name: 'Passed', value: state.results.filter(r => r.status === 'PASS').length, color: '#10b981' },
    { name: 'Failed', value: state.results.filter(r => r.status === 'FAIL').length, color: '#f43f5e' }
  ], [state.results]);

  const coverageData = useMemo(() => [
    { name: 'Specs', count: state.validatedSpecs.length },
    { name: 'Covered', count: new Set(state.testCases.flatMap(tc => tc.linkedRequirementIds)).size },
  ], [state.validatedSpecs, state.testCases]);

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900">
      <aside className="w-64 bg-white border-r flex flex-col shadow-sm">
        <div className="p-6 border-b flex items-center gap-3">
          <BrainCircuit className="w-8 h-8 text-indigo-600" />
          <h1 className="font-bold text-lg leading-tight">QA Nexus</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <NavBtn icon={<LayoutDashboard size={18} />} label="Overview" active={activeTab === 'orchestrator'} onClick={() => setActiveTab('orchestrator')} />
          <NavBtn icon={<ClipboardCheck size={18} />} label="Specs" active={activeTab === 'agent1'} onClick={() => setActiveTab('agent1')} disabled={!state.validatedSpecs.length} />
          <NavBtn icon={<FileEdit size={18} />} label="Tests" active={activeTab === 'agent2'} onClick={() => setActiveTab('agent2')} disabled={!state.testCases.length} />
          <NavBtn icon={<PlayCircle size={18} />} label="Results" active={activeTab === 'agent3'} onClick={() => setActiveTab('agent3')} disabled={!state.results.length} />
          <NavBtn icon={<BarChart3 size={18} />} label="Reports" active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} disabled={!state.results.length} />
        </nav>
        <div className="p-4 border-t space-y-2">
           <button onClick={() => setState({ ...state, status: WorkflowStatus.IDLE, rawRequirements: '', validatedSpecs: [], testCases: [], results: [] })} className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors">
             <RefreshCw size={14} /> Reset System
           </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between">
          <h2 className="font-bold text-slate-700">{activeTab.toUpperCase()}</h2>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-1 bg-slate-50 rounded-full border">Status: {state.status}</div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
          {activeTab === 'orchestrator' && (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
                  <h3 className="text-sm font-bold flex items-center gap-2"><Database size={16} /> Jira Sync</h3>
                  <div className="flex gap-2">
                    <label htmlFor="jira-ticket" className="sr-only">Jira Ticket ID</label>
                    <input 
                      id="jira-ticket"
                      value={jiraIssueInput} 
                      onChange={e => setJiraIssueInput(e.target.value)} 
                      placeholder="Ticket ID (e.g., AUTH-101)" 
                      className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:border-transparent transition-all" 
                      aria-label="Jira ticket ID" 
                      aria-describedby="jira-help" 
                    />
                    <p id="jira-help" className="text-xs text-slate-500 mt-1">💡 Enter your Jira ticket ID to pull requirements directly</p>
                    <button 
                      onClick={handleJiraFetch} 
                      disabled={isJiraLoading || !jiraIssueInput.trim()} 
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 transition-all" 
                      aria-busy={isJiraLoading} 
                      aria-label="Fetch requirements from Jira"
                    >
                      {isJiraLoading ? (
                        <span className="inline-flex items-center gap-1">
                          <Loader2 size={14} className="animate-spin" /> Syncing...
                        </span>
                      ) : (
                        'Fetch'
                      )}
                    </button>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-4">
                  <Github size={32} className="text-slate-400" />
                  <div>
                    <h3 className="text-sm font-bold">GitHub Repository</h3>
                    <p className="text-xs text-slate-400">repo: core-testing-matrix</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-4">
                <h3 className="font-bold">Requirement Staging</h3>
                <label htmlFor="requirements-input" className="block text-sm font-semibold text-slate-700 mb-2">Requirements</label>
                <textarea 
                  id="requirements-input"
                  value={state.rawRequirements} 
                  onChange={e => setState(p => ({ ...p, rawRequirements: e.target.value }))} 
                  className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:border-transparent transition-all resize-none" 
                  placeholder="Paste requirements, PRD, or user stories here..." 
                  aria-label="Raw requirements input" 
                  aria-describedby="requirements-help" 
                />
                <div className="flex justify-between items-center mt-2">
                  <p id="requirements-help" className="text-xs text-slate-500">
                    💡 Include business requirements, acceptance criteria, and edge cases for best results
                  </p>
                  <span className="text-xs text-slate-500">{state.rawRequirements.length} characters</span>
                </div>
                <div className="flex justify-end">
                  <button onClick={runWorkflow} disabled={state.status !== WorkflowStatus.IDLE || !state.rawRequirements.trim()} aria-busy={state.status !== WorkflowStatus.IDLE} aria-label="Launch multi-agent QA pipeline" className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed disabled:shadow-none focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 transition-all flex items-center gap-2">
                    {state.status !== WorkflowStatus.IDLE && <Loader2 size={16} className="animate-spin" />}
                  {state.status === WorkflowStatus.IDLE ? 'Launch Pipeline' : `Running: ${state.status.replace(/_/g, ' ')}`}
                  {state.status === WorkflowStatus.IDLE && <ChevronRight size={16} />}
                  </button>
                </div>
              </div>

              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold mb-4 uppercase tracking-widest"><Terminal size={14}/> Agent Thinking log</div>
                <pre className="text-indigo-200 text-xs mono leading-relaxed opacity-80 max-h-48 overflow-y-auto">{state.thinkingProcess}</pre>
              </div>
            </div>
          )}

          {activeTab === 'agent1' && (
            <div className="max-w-4xl mx-auto space-y-4">
              {state.validatedSpecs.map(spec => {
                const associatedTests = testCasesByReq[spec.requirementId] || [];
                const resMap = new Map<string, string>(state.results.map(r => [r.testCaseId, r.status]));
                
                return (
                  <div key={spec.requirementId} id={`spec-${spec.requirementId}`} className={`bg-white p-6 rounded-2xl border transition-all ${spec.requirementId === highlightedReqId ? 'border-indigo-500 ring-4 ring-indigo-50 shadow-lg' : 'border-slate-200 shadow-sm'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-start gap-4">
                        <div>
                          <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md uppercase tracking-wider">{spec.requirementId}</span>
                          <h4 className="text-lg font-bold mt-2">{spec.title}</h4>
                        </div>
                        {associatedTests.length > 0 && (
                          <div className="flex gap-1 mt-2.5">
                            {associatedTests.map(tc => {
                              const status = resMap.get(tc.id) || 'NOT_RUN';
                              const colorClass = status === 'PASS' ? 'text-emerald-500' : status === 'FAIL' ? 'text-rose-500' : 'text-slate-200';
                              return (
                                <span key={tc.id} title={`${tc.id}: ${status}`} className="inline-flex">
                                  <Circle size={10} fill="currentColor" className={colorClass} />
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      <button onClick={() => navigateToTests(spec.requirementId)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><MapIcon size={18}/></button>
                    </div>
                    <p className="text-sm text-slate-500 mb-4">{spec.description}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <h5 className="text-[10px] font-bold text-slate-400 uppercase mb-2">Acceptance Criteria</h5>
                        <ul className="text-xs space-y-1 list-disc list-inside">{spec.acceptanceCriteria.map((ac, i) => <li key={i}>{ac}</li>)}</ul>
                      </div>
                      {spec.ambiguities.length > 0 && (
                        <div className="p-4 bg-rose-50 rounded-xl border border-rose-100">
                          <h5 className="text-[10px] font-bold text-rose-400 uppercase mb-2">Ambiguities</h5>
                          <ul className="text-xs space-y-1 list-inside text-rose-700">{spec.ambiguities.map((am, i) => <li key={i}>• {am}</li>)}</ul>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'agent2' && (
            <div className="max-w-4xl mx-auto space-y-6">
              {highlightedReqId && (
                <div className="flex items-center justify-between bg-indigo-600 text-white p-4 rounded-xl shadow-lg animate-in fade-in slide-in-from-top-2">
                  <span className="text-sm font-bold flex items-center gap-2"><Workflow size={16}/> Viewing scenarios for: {highlightedReqId}</span>
                  <button onClick={() => setHighlightedReqId(null)}><X size={16}/></button>
                </div>
              )}
              {filteredTestCases.map(tc => (
                <div key={tc.id} id={`tc-card-${tc.id}`} className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                  <div className="px-6 py-4 bg-slate-50 border-b flex justify-between items-center">
                    <h4 className="font-bold text-slate-700">{tc.id} - {tc.category}</h4>
                    <div className="flex gap-2">
                      {tc.linkedRequirementIds.map(rid => (
                        <button key={rid} onClick={() => navigateToSpec(rid)} className={`text-[10px] font-bold px-2 py-1 rounded border transition-all ${rid === highlightedReqId ? 'bg-indigo-600 text-white border-indigo-700 shadow-md scale-105' : 'bg-white text-slate-400 hover:text-indigo-600'}`}>{rid}</button>
                      ))}
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="text-xs text-slate-500 italic">Pre: {tc.preconditions}</div>
                    <div className="space-y-2">
                      {tc.steps.map((s, i) => <div key={i} className="text-sm flex gap-3"><span className="text-slate-300 font-bold">{i+1}.</span> {s}</div>)}
                    </div>
                    <div className="mt-4 p-4 bg-slate-900 text-indigo-400 rounded-xl text-sm font-bold flex items-center gap-2"><ArrowRight size={14}/> {tc.expectedOutcomes}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'agent3' && (
            <div className="max-w-4xl mx-auto space-y-4">
              {state.results.map(res => (
                <div key={res.testCaseId} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex">
                  <div className={`w-32 flex flex-col items-center justify-center ${res.status === 'PASS' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {res.status === 'PASS' ? <CheckCircle2 size={32}/> : <AlertCircle size={32}/>}
                    <span className="text-[10px] font-black uppercase tracking-widest mt-2">{res.status}</span>
                  </div>
                  <div className="flex-1 p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold">{res.testCaseId}</h4>
                      {res.status === 'FAIL' && !res.githubIssueUrl && (
                        <button onClick={() => handleGithubIssue(res)} disabled={githubCreatingId === res.testCaseId} className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg">{githubCreatingId === res.testCaseId ? '...' : 'Report'}</button>
                      )}
                      {res.githubIssueUrl && <a href={res.githubIssueUrl} target="_blank" className="text-emerald-600 text-xs font-bold underline">Linked Issue</a>}
                    </div>
                    <pre className="bg-slate-950 text-emerald-400 p-4 rounded-xl text-xs mono max-h-32 overflow-y-auto">{res.logs}</pre>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="max-w-5xl mx-auto space-y-8">
              <div className="grid grid-cols-3 gap-6">
                 <StatCard label="Traceability" value={`${Math.round((new Set(state.testCases.flatMap(tc => tc.linkedRequirementIds)).size / (state.validatedSpecs.length || 1)) * 100)}%`} color="indigo" />
                 <StatCard label="Stability" value={`${Math.round((state.results.filter(r => r.status === 'PASS').length / (state.results.length || 1)) * 100)}%`} color="emerald" />
                 <StatCard label="Failures" value={state.results.filter(r => r.status === 'FAIL').length.toString()} color="rose" />
              </div>
              <div className="grid grid-cols-2 gap-8">
                 <div className="bg-white p-8 rounded-3xl border shadow-sm h-64"><ResponsiveContainer><PieChart><Pie data={chartData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value"><Cell fill="#10b981"/><Cell fill="#f43f5e"/></Pie><Tooltip/></PieChart></ResponsiveContainer></div>
                 <div className="bg-white p-8 rounded-3xl border shadow-sm h-64"><ResponsiveContainer><BarChart data={coverageData}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="name"/><YAxis/><Tooltip/><Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]}/></BarChart></ResponsiveContainer></div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const NavBtn = ({ icon, label, active, onClick, disabled }: any) => (
  <button onClick={onClick} disabled={disabled} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${active ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'} ${disabled ? 'opacity-25' : ''}`}>
    {icon} {label}
  </button>
);

const StatCard = ({ label, value, color }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-1">
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
    <p className={`text-3xl font-black text-${color}-600`}>{value}</p>
  </div>
);

export default App;




