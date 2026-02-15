import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  WorkflowStatus,
  WorkflowState,
  TestCase,
  ExecutionResult
} from '@/types';
import {
  reviewRequirements,
  generateTestCases,
  executeTests,
  fetchJiraRequirement,
  createGithubIssue
} from '@/services/geminiService';
import { logger } from '@/utils/logger';
import { persistenceService } from '@/services/persistenceService';
import { agentMemory } from '@/services/memoryService';

export const useWorkflow = () => {
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

  const clearSession = useCallback(() => {
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

  const chartData = useMemo(() => [
    { name: 'Passed', value: state.results.filter(r => r.status === 'PASS').length, color: '#10b981' },
    { name: 'Failed', value: state.results.filter(r => r.status === 'FAIL').length, color: '#f43f5e' }
  ], [state.results]);

  const coverageData = useMemo(() => [
    { name: 'Specs', count: state.validatedSpecs.length },
    { name: 'Covered', count: new Set(state.testCases.flatMap(tc => tc.linkedRequirementIds)).size },
  ], [state.validatedSpecs, state.testCases]);

  // Save state on change
  useEffect(() => {
    persistenceService.saveState(state);
  }, [state]);

  return {
    state,
    setState,
    activeTab,
    setActiveTab,
    highlightedReqId,
    setHighlightedReqId,
    tcSearchTerm,
    setTcSearchTerm,
    jiraIssueInput,
    setJiraIssueInput,
    isJiraLoading,
    githubCreatingId,
    runWorkflow,
    handleJiraFetch,
    handleGithubIssue,
    clearSession,
    navigateToTests,
    navigateToSpec,
    filteredTestCases,
    testCasesByReq,
    chartData,
    coverageData
  };
};
