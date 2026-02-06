import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  LayoutDashboard,
  ClipboardCheck,
  FileEdit,
  PlayCircle,
  BarChart3,
  RefreshCw,
  BrainCircuit
} from 'lucide-react';
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
import { OrchestratorTab } from './components/tabs/OrchestratorTab';
import { Agent1Tab } from './components/tabs/Agent1Tab';
import { Agent2Tab } from './components/tabs/Agent2Tab';
import { Agent3Tab } from './components/tabs/Agent3Tab';
import { ReportsTab } from './components/tabs/ReportsTab';
import { NavBtn } from './components/NavBtn';

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

  const runWorkflow = useCallback(async () => {
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
      const message = err instanceof Error ? err.message : String(err);
      setState(p => ({ ...p, status: WorkflowStatus.FAILED, thinkingProcess: '[ERROR] Workflow aborted.', error: message }));
    }
  }, [state.rawRequirements]);

  const handleJiraFetch = useCallback(async () => {
    if (!jiraIssueInput.trim()) return;
    setIsJiraLoading(true);
    try {
      const content = await fetchJiraRequirement(jiraIssueInput);
      setState(p => ({ ...p, rawRequirements: (p.rawRequirements ? p.rawRequirements + '\n\n' : '') + content }));
      setJiraIssueInput('');
    } finally {
      setIsJiraLoading(false);
    }
  }, [jiraIssueInput]);

  const handleGithubIssue = useCallback(async (res: ExecutionResult) => {
    setGithubCreatingId(res.testCaseId);
    try {
      const url = await createGithubIssue(res.testCaseId, res.logs);
      setState(p => ({ ...p, results: p.results.map(r => r.testCaseId === res.testCaseId ? { ...r, githubIssueUrl: url } : r) }));
    } finally {
      setGithubCreatingId(null);
    }
  }, []);

  const navigateToTests = useCallback((reqId: string) => {
    setHighlightedReqId(reqId);
    setTcSearchTerm('');
    setActiveTab('agent2');
  }, []);

  const navigateToSpec = useCallback((reqId: string) => {
    setHighlightedReqId(reqId);
    setActiveTab('agent1');
  }, []);

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
          <div className="flex items-center gap-3">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-1 bg-slate-50 rounded-full border">Status: {state.status}</div>
            {state.error && <div title={state.error} className="text-xs text-rose-600 font-bold">⚠️ {state.error}</div>}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
          {activeTab === 'orchestrator' && (
            <OrchestratorTab
              jiraIssueInput={jiraIssueInput}
              setJiraIssueInput={setJiraIssueInput}
              handleJiraFetch={handleJiraFetch}
              isJiraLoading={isJiraLoading}
              rawRequirements={state.rawRequirements}
              setRawRequirements={(val) => setState(p => ({ ...p, rawRequirements: val }))}
              runWorkflow={runWorkflow}
              status={state.status}
              thinkingProcess={state.thinkingProcess}
            />
          )}

          {activeTab === 'agent1' && (
            <Agent1Tab
              validatedSpecs={state.validatedSpecs}
              testCasesByReq={testCasesByReq}
              results={state.results}
              highlightedReqId={highlightedReqId}
              navigateToTests={navigateToTests}
            />
          )}

          {activeTab === 'agent2' && (
            <Agent2Tab
              filteredTestCases={filteredTestCases}
              highlightedReqId={highlightedReqId}
              setHighlightedReqId={setHighlightedReqId}
              navigateToSpec={navigateToSpec}
            />
          )}

          {activeTab === 'agent3' && (
            <Agent3Tab
              results={state.results}
              handleGithubIssue={handleGithubIssue}
              githubCreatingId={githubCreatingId}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsTab
              chartData={chartData}
              coverageData={coverageData}
              traceability={`${Math.round((new Set(state.testCases.flatMap(tc => tc.linkedRequirementIds)).size / (state.validatedSpecs.length || 1)) * 100)}%`}
              stability={`${Math.round((state.results.filter(r => r.status === 'PASS').length / (state.results.length || 1)) * 100)}%`}
              failures={state.results.filter(r => r.status === 'FAIL').length.toString()}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;




