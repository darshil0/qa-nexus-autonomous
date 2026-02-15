import React from 'react';
import { exportTestCasesJson, exportTestCasesCsv, exportResultsJson, exportResultsCsv } from '@/utils/exportUtils';
import { TestCase, ExecutionResult, WorkflowStatus } from '@/types';

interface HeaderProps {
  activeTab: string;
  status: WorkflowStatus;
  error?: string;
  testCases: TestCase[];
  results: ExecutionResult[];
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  status,
  error,
  testCases,
  results
}) => {
  return (
    <header className="header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>WORKSPACE</span>
        <div style={{ width: '1px', height: '16px', background: 'var(--glass-border)' }}></div>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{activeTab.toUpperCase()}</h2>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {activeTab === 'agent2' && testCases.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', borderRight: '1px solid var(--glass-border)', paddingRight: '1rem' }}>
            <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 800, alignSelf: 'center' }}>EXPORT:</span>
            <button onClick={() => exportTestCasesJson(testCases)} className="btn-secondary" style={{ fontSize: '0.6rem', padding: '0.2rem 0.6rem' }}>JSON</button>
            <button onClick={() => exportTestCasesCsv(testCases)} className="btn-secondary" style={{ fontSize: '0.6rem', padding: '0.2rem 0.6rem' }}>CSV</button>
          </div>
        )}
        {(activeTab === 'agent3' || activeTab === 'reports') && results.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', borderRight: '1px solid var(--glass-border)', paddingRight: '1rem' }}>
            <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 800, alignSelf: 'center' }}>EXPORT:</span>
            <button onClick={() => exportResultsJson(results)} className="btn-secondary" style={{ fontSize: '0.6rem', padding: '0.2rem 0.6rem' }}>JSON</button>
            <button onClick={() => exportResultsCsv(results)} className="btn-secondary" style={{ fontSize: '0.6rem', padding: '0.2rem 0.6rem' }}>CSV</button>
          </div>
        )}
        <div className="badge" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', border: '1px solid rgba(99, 102, 241, 0.2)', fontSize: '0.65rem' }}>
          STATUS: {status}
        </div>
        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', fontSize: '0.875rem', fontWeight: 600 }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 8px var(--accent)' }}></div>
            {error}
          </div>
        )}
      </div>
    </header>
  );
};
