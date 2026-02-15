import React from 'react';
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
import { NavBtn } from '@/components/common/NavBtn';


interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: 'orchestrator' | 'agent1' | 'agent2' | 'agent3' | 'reports' | 'settings' | 'health') => void;
  hasSpecs: boolean;
  hasTestCases: boolean;
  hasResults: boolean;
  clearSession: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  hasSpecs,
  hasTestCases,
  hasResults,
  clearSession
}) => {
  return (
    <aside className="sidebar">
      <div style={{ paddingBottom: '2rem', borderBottom: '1px solid var(--glass-border)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <BrainCircuit className="pulse-primary" style={{ color: 'var(--primary)', width: '40px', height: '40px' }} />
        <div>
          <h1 className="brand-text" style={{ fontSize: '1.25rem', fontWeight: 800, background: 'linear-gradient(to right, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>QA NEXUS</h1>
          <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.1em' }}>AUTONOMOUS V2.10</p>
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
          disabled={!hasSpecs}
          onClick={() => setActiveTab('agent1')}
        />
        <NavBtn
          icon={<FileEdit size={20} />}
          label="Test Designer"
          active={activeTab === 'agent2'}
          disabled={!hasTestCases}
          onClick={() => setActiveTab('agent2')}
        />
        <NavBtn
          icon={<PlayCircle size={20} />}
          label="Execution"
          active={activeTab === 'agent3'}
          disabled={!hasResults}
          onClick={() => setActiveTab('agent3')}
        />
        <NavBtn
          icon={<BarChart3 size={20} />}
          label="Analytics"
          active={activeTab === 'reports'}
          disabled={!hasResults}
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
          onClick={clearSession}
          className="btn-secondary"
          style={{ width: '100%', fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
        >
          <RefreshCw size={14} /> Clear Session
        </button>
      </div>
    </aside>
  );
};
