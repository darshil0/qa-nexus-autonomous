import { render, screen, fireEvent } from '@testing-library/react';
import { expect, vi, describe, it, beforeEach } from 'vitest';
import { Agent1Tab } from '../components/tabs/Agent1Tab';
import { Agent2Tab } from '../components/tabs/Agent2Tab';
import { Agent3Tab } from '../components/tabs/Agent3Tab';
import { HealthDashboardTab } from '../components/tabs/HealthDashboardTab';
import { OrchestratorTab } from '../components/tabs/OrchestratorTab';
import { ReportsTab } from '../components/tabs/ReportsTab';
import { SettingsTab } from '../components/tabs/SettingsTab';
import { Sidebar } from '../components/layout/Sidebar';
import { WorkflowStatus } from '../types';

global.ResizeObserver = class { observe(){} unobserve(){} disconnect(){} };

describe('UI Coverage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Agent1Tab empty and full states', () => {
    const navSpy = vi.fn();
    const { rerender } = render(<Agent1Tab validatedSpecs={[]} testCasesByReq={{}} results={[]} highlightedReqId={null} navigateToTests={navSpy} />);
    expect(screen.getByText('No Requirements Analyzed')).toBeDefined();

    const specs = [{ requirementId: 'R1', title: 'T1', description: 'D1', acceptanceCriteria: ['AC1'], riskClassification: 'L', priority: 'P1', ambiguities: [] }];
    rerender(<Agent1Tab validatedSpecs={specs} testCasesByReq={{'R1': [{id:'TC1'} as any]}} results={[{testCaseId:'TC1', status:'PASS'}]} highlightedReqId="R1" navigateToTests={navSpy} />);
    expect(screen.getByText('T1')).toBeDefined();

    // Click navigate to tests
    fireEvent.click(screen.getByTitle('Trace to Tests'));
    expect(navSpy).toHaveBeenCalledWith('R1');

    // With ambiguities
    const specs2 = [{ ...specs[0], ambiguities: ['A1'] }];
    rerender(<Agent1Tab validatedSpecs={specs2} testCasesByReq={{}} results={[]} highlightedReqId={null} navigateToTests={navSpy} />);
    expect(screen.getByText('A1')).toBeDefined();
  });

  it('Agent2Tab empty and full states', () => {
    const setHighlightSpy = vi.fn();
    const setTcSpy = vi.fn();
    const { rerender } = render(<Agent2Tab filteredTestCases={[]} highlightedReqId={null} setHighlightedReqId={setHighlightSpy} navigateToSpec={vi.fn()} tcSearchTerm="" setTcSearchTerm={setTcSpy} />);
    expect(screen.getByText('No Test Cases Found')).toBeDefined();

    // Trigger search change
    fireEvent.change(screen.getByPlaceholderText(/Search test cases/), { target: { value: 'test' } });
    expect(setTcSpy).toHaveBeenCalledWith('test');

    const tcs = [{ id: 'TC1', category: 'C1', steps: ['S1'], expectedOutcomes: 'O1', linkedRequirementIds: ['R1'], isAutomationCandidate: true, preconditions: 'P1' }];
    rerender(<Agent2Tab filteredTestCases={tcs} highlightedReqId="R1" setHighlightedReqId={setHighlightSpy} navigateToSpec={vi.fn()} tcSearchTerm="" setTcSearchTerm={setTcSpy} />);
    expect(screen.getByText('TC1')).toBeDefined();

    // Click X to clear highlight
    fireEvent.click(screen.getByRole('button', { name: '' })); // The X button
    expect(setHighlightSpy).toHaveBeenCalledWith(null);

    // Click requirement badge
    fireEvent.click(screen.getByText('R1'));
  });

  it('Agent3Tab empty and full states', () => {
    const ghSpy = vi.fn();
    const { rerender } = render(<Agent3Tab results={[]} handleGithubIssue={ghSpy} githubCreatingId={null} />);
    expect(screen.getByText('No Execution Results')).toBeDefined();

    const res = [{ testCaseId: 'TC1', status: 'FAIL', logs: 'L', timestamp: 'T' } as any];
    rerender(<Agent3Tab results={res} handleGithubIssue={ghSpy} githubCreatingId={null} />);
    expect(screen.getByText('TC1')).toBeDefined();

    // Click Create GH Issue
    fireEvent.click(screen.getByText('Create GH Issue'));
    expect(ghSpy).toHaveBeenCalled();

    // With issue URL
    const res2 = [{ ...res[0], githubIssueUrl: 'http://gh' }];
    rerender(<Agent3Tab results={res2} handleGithubIssue={ghSpy} githubCreatingId={null} />);
    expect(screen.getByText('View GitHub Issue →')).toBeDefined();
  });

  it('OrchestratorTab states', () => {
    const setJiraSpy = vi.fn();
    const setReqSpy = vi.fn();
    const fetchJiraSpy = vi.fn();
    const { rerender } = render(<OrchestratorTab jiraIssueInput="A-1" setJiraIssueInput={setJiraSpy} handleJiraFetch={fetchJiraSpy} isJiraLoading={false} rawRequirements="req" setRawRequirements={setReqSpy} runWorkflow={vi.fn()} status={WorkflowStatus.IDLE} thinkingProcess="thinking" />);

    fireEvent.change(screen.getByPlaceholderText(/Ticket ID/), { target: { value: 'B-2' } });
    expect(setJiraSpy).toHaveBeenCalledWith('B-2');

    fireEvent.click(screen.getByText('Fetch'));
    expect(fetchJiraSpy).toHaveBeenCalled();

    fireEvent.change(screen.getByPlaceholderText(/Enter or paste/), { target: { value: 'new req' } });
    expect(setReqSpy).toHaveBeenCalledWith('new req');

    rerender(<OrchestratorTab jiraIssueInput="A-1" setJiraIssueInput={setJiraSpy} handleJiraFetch={fetchJiraSpy} isJiraLoading={true} rawRequirements="req" setRawRequirements={setReqSpy} runWorkflow={vi.fn()} status={WorkflowStatus.AGENT1_REVIEWING} thinkingProcess="thinking" />);
    expect(screen.getByText('ORCHESTRATING...')).toBeDefined();
  });

  it('ReportsTab empty and full states', () => {
    const { rerender } = render(<ReportsTab chartData={[]} coverageData={[]} traceability="0" stability="0" failures="0" refinement="0" clarity="0" />);
    expect(screen.getByText('No Analytics Available')).toBeDefined();

    // Coverage data only
    render(<ReportsTab chartData={[]} coverageData={[{name:'C', count:1}]} traceability="1" stability="1" failures="0" refinement="1" clarity="1" />);

    // Both
    render(<ReportsTab chartData={[{name:'P', value:1, color:'g'}]} coverageData={[{name:'C', count:1}]} traceability="1" stability="1" failures="0" refinement="1" clarity="1" />);
  });

  it('HealthDashboardTab', () => {
    const metrics = { totalToolCalls: 5, averageLoopDepth: 2, totalTokensEstimated: 1000, latencyMs: 2000, toolFrequency: { 'jira': 5, 'github': 2 }, activeLoops: 1 };
    render(<HealthDashboardTab metrics={metrics} />);
  });

  it('Sidebar and SettingsTab', () => {
    const setTabSpy = vi.fn();
    render(<Sidebar activeTab="agent1" setActiveTab={setTabSpy} hasSpecs={true} hasTestCases={true} hasResults={true} clearSession={vi.fn()} />);

    fireEvent.click(screen.getByText('Orchestrator'));
    expect(setTabSpy).toHaveBeenCalledWith('orchestrator');
    fireEvent.click(screen.getByText('Requirements'));
    fireEvent.click(screen.getByText('Test Designer'));
    fireEvent.click(screen.getByText('Execution'));
    fireEvent.click(screen.getByText('Analytics'));
    fireEvent.click(screen.getByText('AI Settings'));
    fireEvent.click(screen.getByText('Loop Health'));

    fireEvent.click(screen.getByText('Clear Session'));

    const setSettingsSpy = vi.fn();
    const { rerender } = render(<SettingsTab settings={{ useFlashModel: false, maxIterations: 3, temperature: 0.7 }} setSettings={setSettingsSpy} />);

    // Toggle flash mode
    const flashBtn = screen.getByText('High-Performance Mode').closest('div[style*="justify-content: space-between"]')?.querySelector('button');
    if (flashBtn) fireEvent.click(flashBtn);
    expect(setSettingsSpy).toHaveBeenCalled();

    fireEvent.change(screen.getAllByRole('slider')[0], { target: { value: '5' } });
    fireEvent.change(screen.getAllByRole('slider')[1], { target: { value: '0.9' } });
  });
});
