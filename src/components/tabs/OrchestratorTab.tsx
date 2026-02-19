import React from 'react';
import { Database, Loader2, Github, ChevronRight } from 'lucide-react';
import { WorkflowStatus } from '@/types';
import { AgentThinkingLog } from '@/components/layout/AgentThinkingLog';

interface OrchestratorTabProps {
    jiraIssueInput: string;
    setJiraIssueInput: (val: string) => void;
    handleJiraFetch: () => void;
    isJiraLoading: boolean;
    rawRequirements: string;
    setRawRequirements: (val: string) => void;
    runWorkflow: () => void;
    status: WorkflowStatus;
    thinkingProcess: string;
}

export const OrchestratorTab: React.FC<OrchestratorTabProps> = ({
    jiraIssueInput,
    setJiraIssueInput,
    handleJiraFetch,
    isJiraLoading,
    rawRequirements,
    setRawRequirements,
    runWorkflow,
    status,
    thinkingProcess
}) => {
    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ padding: '0.5rem', borderRadius: '0.5rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>
                            <Database size={18} />
                        </div>
                        <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>Jira Synchronizer</h3>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <input
                            id="jira-ticket"
                            value={jiraIssueInput}
                            onChange={e => setJiraIssueInput(e.target.value)}
                            placeholder="Ticket ID (e.g., AUTH-101)"
                            className="input-field"
                            style={{ fontSize: '0.875rem' }}
                        />
                        <button
                            onClick={handleJiraFetch}
                            disabled={isJiraLoading || !jiraIssueInput.trim()}
                            className="btn-primary"
                            style={{ padding: '0 1.25rem' }}
                        >
                            {isJiraLoading ? <Loader2 size={16} className="animate-spin" /> : 'Fetch'}
                        </button>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Pull requirements directly from your synchronized Jira workspace.
                    </p>
                </div>

                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{ padding: '1rem', borderRadius: '1rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--glass-border)' }}>
                        <Github size={32} style={{ color: 'var(--text-muted)' }} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>GitHub Environment</h3>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>repo: qa-nexus-autonomous</p>
                        <div style={{ marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)' }}></div>
                            <span style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--success)' }}>CONNECTED</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1.125rem' }}>Requirement Staging</h3>
                    <div className="badge-warning" style={{ fontSize: '0.6rem', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontWeight: 800 }}>DRAFT MODE</div>
                </div>

                <textarea
                    id="requirements-input"
                    value={rawRequirements}
                    onChange={e => setRawRequirements(e.target.value)}
                    className="input-field"
                    style={{ height: '220px', resize: 'none', lineHeight: '1.6', fontSize: '0.9rem' }}
                    placeholder="Enter or paste your project requirements, technical specifications, or user stories..."
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <span>Chars: {rawRequirements.length}</span>
                        <span>Source: {jiraIssueInput ? 'Jira' : 'Manual'}</span>
                    </div>

                    <button
                        onClick={runWorkflow}
                        disabled={(status !== WorkflowStatus.IDLE && status !== WorkflowStatus.COMPLETED && status !== WorkflowStatus.FAILED) || !rawRequirements.trim()}
                        className="btn-primary"
                        style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}
                    >
                        {(status !== WorkflowStatus.IDLE && status !== WorkflowStatus.COMPLETED && status !== WorkflowStatus.FAILED) ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Loader2 size={18} className="animate-spin" />
                                <span>ORCHESTRATING...</span>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <span>LAUNCH PIPELINE</span>
                                <ChevronRight size={18} />
                            </div>
                        )}
                    </button>
                </div>
            </div>

            <AgentThinkingLog thinkingProcess={thinkingProcess} />
        </div>
    );
};
