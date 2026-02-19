import React, { useEffect, useRef } from 'react';
import { useWorkflow } from '@/hooks/useWorkflow';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { OrchestratorTab } from '@/components/tabs/OrchestratorTab';
import { Agent1Tab } from '@/components/tabs/Agent1Tab';
import { Agent2Tab } from '@/components/tabs/Agent2Tab';
import { Agent3Tab } from '@/components/tabs/Agent3Tab';
import { ReportsTab } from '@/components/tabs/ReportsTab';
import { SettingsTab } from '@/components/tabs/SettingsTab';
import { HealthDashboardTab } from '@/components/tabs/HealthDashboardTab';

const App: React.FC = () => {
  const {
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
  } = useWorkflow();

  const mainContentRef = useRef<HTMLDivElement>(null);

  // Focus main content when tab changes for better accessibility
  useEffect(() => {
    mainContentRef.current?.focus();
  }, [activeTab]);

  // Scroll to highlighted element
  useEffect(() => {
    if (highlightedReqId) {
      const prefix = activeTab === 'agent1' ? 'spec-' : 'tc-card-';
      const targetId = prefix + (activeTab === 'agent1' ? highlightedReqId : (filteredTestCases[0]?.id || ''));
      const el = document.getElementById(targetId);
      if (el) {setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);}
    }
  }, [activeTab, highlightedReqId, filteredTestCases]);

  return (
    <div className="app-container">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasSpecs={state.validatedSpecs.length > 0}
        hasTestCases={state.testCases.length > 0}
        hasResults={state.results.length > 0}
        clearSession={clearSession}
      />

      <main className="main-content">
        <Header
          activeTab={activeTab}
          status={state.status}
          error={state.error}
          testCases={state.testCases}
          results={state.results}
        />

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
              tcSearchTerm={tcSearchTerm}
              setTcSearchTerm={setTcSearchTerm}
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
