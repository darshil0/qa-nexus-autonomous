import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  LayoutDashboard,
  ClipboardCheck,
  FileEdit,
  PlayCircle,
  BarChart3,
  RefreshCw,
  BrainCircuit,
  Settings as SettingsIcon,
  Activity
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
import { SettingsTab } from './components/tabs/SettingsTab';
import { HealthDashboardTab } from './components/tabs/HealthDashboardTab';
import { NavBtn } from './components/NavBtn';
import { logger } from './utils/logger';
import { persistenceService } from './services/persistenceService';
import { agentMemory } from './services/memoryService';
import { exportTestCasesJson, exportTestCasesCsv, exportResultsJson, exportResultsCsv } from './utils/exportUtils';

const App: React.FC = () => {
  const [state, setState] = useState<WorkflowState>(() => {
    const saved = persistenceService.loadState();
    return saved || {
      status: WorkflowStatus.IDLE,
      rawRequirements: '',
      validatedSpecs: [],
      testCases: [],
      results: [],
      thinkingProcess: 'System ready.',
      jiraIntegration: { connected: true, projectKey: 'QA-AUTO' },
      settings: {
        maxIterations: 3,
        temperature: 0.7,
        useFlashModel: false
      },
      metrics: {
        totalToolCalls: 0,
        averageLoopDepth: 0,
        totalTokensEstimated: 0,
        latencyMs: 0,
        toolFrequency: {},
        activeLoops: 0
      }
    };
  });

  const [activeTab, setActiveTab] = useState<'orchestrator' | 'agent1' | 'agent2' | 'agent3' | 'reports' | 'settings' | 'health'>('orchestrator');
  const [highlightedReqId, setHighlightedReqId] = useState<string | null>(null);
  const [tcSearchTerm, setTcSearchTerm] = useState('');
  const [jiraIssueInput, setJiraIssueInput] = useState('');
  const [isJiraLoading, setIsJiraLoading] = useState(false);
  const [githubCreatingId, setGithubCreatingId] = useState<string | null>(null);

  const runWorkflow = useCallback(async () => {
    if (!state.rawRequirements.trim()) {return;}

    try {
      setState(p => ({
        ...p,
        status: WorkflowStatus.AGENT1_REVIEWING,
        thinkingProcess: '[AGENT 1] Reviewing specs...',
        metrics: { ...p.metrics, activeLoops: 1 },
        error: undefined
      }));

      const { specs, thinking: t1, metrics: m1 } = await reviewRequirements(state.rawRequirements, state.settings);

      setState(p => ({
        ...p,
        status: WorkflowStatus.AGENT2_WRITING,
        validatedSpecs: specs,
        thinkingProcess: `[AGENT 1] ${t1}\n[AGENT 2] Designing tests...`,
        metrics: {
          ...p.metrics,
          totalToolCalls: p.metrics.totalToolCalls + m1.totalToolCalls,
          totalTokensEstimated: p.metrics.totalTokensEstimated + m1.totalTokensEstimated,
          latencyMs: (p.metrics.latencyMs + m1.latencyMs) / 2,
          toolFrequency: { ...p.metrics.toolFrequency, ...m1.toolFrequency }
        }
      }));

      const { testCases, thinking: t2, metrics: m2 } = await generateTestCases(specs, state.settings);

      setState(p => ({
        ...p,
        status: WorkflowStatus.AGENT3_EXECUTING,
        testCases,
        thinkingProcess: `[AGENT 2] ${t2}\n[AGENT 3] Running execution...`,
        metrics: {
          ...p.metrics,
          totalToolCalls: p.metrics.totalToolCalls + m2.totalToolCalls,
          totalTokensEstimated: p.metrics.totalTokensEstimated + m2.totalTokensEstimated,
          latencyMs: (p.metrics.latencyMs + m2.latencyMs) / 2,
          toolFrequency: { ...p.metrics.toolFrequency, ...m2.toolFrequency }
        }
      }));

      const { results, thinking: t3, metrics: m3 } = await executeTests(testCases, state.settings);

      setState(p => ({
        ...p,
        status: WorkflowStatus.COMPLETED,
        results,
        thinkingProcess: `Pipeline complete.\n[AGENT 3] ${t3}`,
        metrics: {
          ...p.metrics,
          totalToolCalls: p.metrics.totalToolCalls + m3.totalToolCalls,
          totalTokensEstimated: p.metrics.totalTokensEstimated + m3.totalTokensEstimated,
          latencyMs: (p.metrics.latencyMs + m3.latencyMs) / 2,
          toolFrequency: { ...p.metrics.toolFrequency, ...m3.toolFrequency },
          averageLoopDepth: (m1.averageLoopDepth + m2.averageLoopDepth + m3.averageLoopDepth) / 3,
          activeLoops: 0
        }
      }));

      setActiveTab('reports');
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      logger.error('Workflow execution failed:', err);

      setState(p => ({
        ...p,
        status: WorkflowStatus.FAILED,
        thinkingProcess: '[ERROR] Workflow aborted. Check console for details.',
        error: message
      }));
    }
  }, [state.rawRequirements, state.settings]);

  const handleJiraFetch = useCallback(async () => {
    if (!jiraIssueInput.trim()) {return;}
    setIsJiraLoading(true);
    try {
      const content = await fetchJiraRequirement(jiraIssueInput);
      setState(p => ({ ...p, rawRequirements: (p.rawRequirements ? p.rawRequirements + '\n\n' : '') + content }));
      setJiraIssueInput('');
    } catch (err) {
      logger.error('Jira fetch failed:', err);
      setState(p => ({ ...p, error: 'Failed to fetch from Jira' }));
    } finally {
      setIsJiraLoading(false);
    }
  }, [jiraIssueInput]);

  const handleGithubIssue = useCallback(async (res: ExecutionResult) => {
    setGithubCreatingId(res.testCaseId);
    try {
      const url = await createGithubIssue(res.testCaseId, res.logs);
      setState(p => ({ ...p, results: p.results.map(r => r.testCaseId === res.testCaseId ? { ...r, githubIssueUrl: url } : r) }));
    } catch (err) {
      logger.error('GitHub issue creation failed:', err);
      setState(p => ({ ...p, error: 'Failed to create GitHub issue' }));
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
    if (highlightedReqId) {list = list.filter(tc => tc.linkedRequirementIds.includes(highlightedReqId));}
    const term = tcSearchTerm.toLowerCase();
    if (term) {list = list.filter(tc => tc.id.toLowerCase().includes(term) || tc.category.toLowerCase().includes(term));}
    return list;
  }, [state.testCases, tcSearchTerm, highlightedReqId]);

  const testCasesByReq = useMemo(() => {
    const map: Record<string, TestCase[]> = {};
    state.testCases.forEach(tc => {
      tc.linkedRequirementIds.forEach(rid => {
        if (!map[rid]) {map[rid] = [];}
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
      if (el) {setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);}
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

  const mainContentRef = React.useRef<HTMLDivElement>(null);

  // Save state on change
  useEffect(() => {
    persistenceService.saveState(state);
  }, [state]);

  // Focus main content when tab changes for better accessibility
  useEffect(() => {
    mainContentRef.current?.focus();
  }, [activeTab]);

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div style={{ paddingBottom: '2rem', borderBottom: '1px solid var(--glass-border)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <BrainCircuit className="pulse-primary" style={{ color: 'var(--primary)', width: '40px', height: '40px' }} />
          <div>
            <h1 className="brand-text" style={{ fontSize: '1.25rem', fontWeight: 800, background: 'linear-gradient(to right, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>QA NEXUS</h1>
            <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.1em' }}>AUTONOMOUS V2.9</p>
          </div>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <NavBtn
            icon={<LayoutDashboard size={20} />}
            label="Orchestrator"
            active={activeTab === 'orchestrator'}
            onClick={() => setActiveTab('orchestrator')}
          />
          <NavBtn
            icon={<ClipboardCheck size={20} />}
            label="Requirements"
            active={activeTab === 'agent1'}
            disabled={!state.validatedSpecs.length}
            onClick={() => setActiveTab('agent1')}
          />
          <NavBtn
            icon={<FileEdit size={20} />}
            label="Test Designer"
            active={activeTab === 'agent2'}
            disabled={!state.testCases.length}
            onClick={() => setActiveTab('agent2')}
          />
          <NavBtn
            icon={<PlayCircle size={20} />}
            label="Execution"
            active={activeTab === 'agent3'}
            disabled={!state.results.length}
            onClick={() => setActiveTab('agent3')}
          />
          <NavBtn
            icon={<BarChart3 size={20} />}
            label="Analytics"
            active={activeTab === 'reports'}
            disabled={!state.results.length}
            onClick={() => setActiveTab('reports')}
          />
          <NavBtn
            icon={<SettingsIcon size={20} />}
            label="AI Settings"
            active={activeTab === 'settings'}
            onClick={() => setActiveTab('settings')}
          />
          <NavBtn
            icon={<Activity size={20} />}
            label="Loop Health"
            active={activeTab === 'health'}
            onClick={() => setActiveTab('health')}
          />
        </nav>

        <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
          <button
            onClick={() => {
              persistenceService.clearState();
              agentMemory.clear();
              setState({
                status: WorkflowStatus.IDLE,
                rawRequirements: '',
                validatedSpecs: [],
                testCases: [],
                results: [],
                thinkingProcess: 'System ready.',
              jiraIntegration: { connected: true, projectKey: 'QA-AUTO' },
              settings: {
                maxIterations: 3,
                temperature: 0.7,
                useFlashModel: false
              },
              metrics: {
                totalToolCalls: 0,
                averageLoopDepth: 0,
                totalTokensEstimated: 0,
                latencyMs: 0,
                toolFrequency: {},
                activeLoops: 0
              }
              });
            }}
            className="btn-secondary"
            style={{ width: '100%', fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <RefreshCw size={14} /> Clear Session
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>WORKSPACE</span>
            <div style={{ width: '1px', height: '16px', background: 'var(--glass-border)' }}></div>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{activeTab.toUpperCase()}</h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {activeTab === 'agent2' && state.testCases.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem', borderRight: '1px solid var(--glass-border)', paddingRight: '1rem' }}>
                <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 800, alignSelf: 'center' }}>EXPORT:</span>
                <button onClick={() => exportTestCasesJson(state.testCases)} className="btn-secondary" style={{ fontSize: '0.6rem', padding: '0.2rem 0.6rem' }}>JSON</button>
                <button onClick={() => exportTestCasesCsv(state.testCases)} className="btn-secondary" style={{ fontSize: '0.6rem', padding: '0.2rem 0.6rem' }}>CSV</button>
              </div>
            )}
            {(activeTab === 'agent3' || activeTab === 'reports') && state.results.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem', borderRight: '1px solid var(--glass-border)', paddingRight: '1rem' }}>
                <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 800, alignSelf: 'center' }}>EXPORT:</span>
                <button onClick={() => exportResultsJson(state.results)} className="btn-secondary" style={{ fontSize: '0.6rem', padding: '0.2rem 0.6rem' }}>JSON</button>
                <button onClick={() => exportResultsCsv(state.results)} className="btn-secondary" style={{ fontSize: '0.6rem', padding: '0.2rem 0.6rem' }}>CSV</button>
              </div>
            )}
            <div className="badge" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', border: '1px solid rgba(99, 102, 241, 0.2)', fontSize: '0.65rem' }}>
              STATUS: {state.status}
            </div>
            {state.error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', fontSize: '0.875rem', fontWeight: 600 }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 8px var(--accent)' }}></div>
                {state.error}
              </div>
            )}
          </div>
        </header>

        <div
          ref={mainContentRef}
          tabIndex={-1}
          className="animate-fade-in"
          style={{ flex: 1, overflowY: 'auto', padding: '2rem', outline: 'none' }}
        >
          {activeTab === 'orchestrator' && (
            <OrchestratorTab
              jiraIssueInput={jiraIssueInput}
              setJiraIssueInput={setJiraIssueInput}
              handleJiraFetch={() => { void handleJiraFetch(); }}
              isJiraLoading={isJiraLoading}
              rawRequirements={state.rawRequirements}
              setRawRequirements={(val) => setState(p => ({ ...p, rawRequirements: val }))}
              runWorkflow={() => { void runWorkflow(); }}
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
              handleGithubIssue={(res) => { void handleGithubIssue(res); }}
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

          {activeTab === 'settings' && (
            <SettingsTab
              settings={state.settings}
              setSettings={(s) => setState(p => ({ ...p, settings: s }))}
            />
          )}

          {activeTab === 'health' && (
            <HealthDashboardTab metrics={state.metrics} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
