import React from 'react';
import { CheckCircle2, AlertCircle, PlayCircle } from 'lucide-react';
import type { ExecutionResult } from '@/types';

interface Agent3TabProps {
    results: ExecutionResult[];
    handleGithubIssue: (res: ExecutionResult) => void;
    githubCreatingId: string | null;
}

export const Agent3Tab: React.FC<Agent3TabProps> = ({
    results,
    handleGithubIssue,
    githubCreatingId
}) => {
    if (!results || results.length === 0) {
        return (
            <div className="card" style={{ textAlign: 'center', padding: '3rem', maxWidth: '900px', margin: '0 auto' }}>
                <PlayCircle size={48} style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', opacity: 0.5 }} />
                <h3 style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    No Execution Results
                </h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Launch the pipeline to execute generated test scenarios.
                </p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {results.map((res) => (
                <div key={res.testCaseId} className="card animate-fade-in" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{
                        padding: '1.25rem 1.5rem',
                        background: res.status === 'PASS' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                        borderBottom: '1px solid var(--glass-border)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ color: res.status === 'PASS' ? 'var(--success)' : 'var(--accent)' }}>
                                {res.status === 'PASS' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                            </div>
                            <h4 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>{res.testCaseId}</h4>
                            <span className="badge" style={{
                                background: res.status === 'PASS' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                                color: res.status === 'PASS' ? 'var(--success)' : 'var(--accent)',
                                borderColor: res.status === 'PASS' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)'
                            }}>
                                {res.status}
                            </span>
                        </div>

                        {res.status === 'FAIL' && (
                            <button
                                onClick={() => handleGithubIssue(res)}
                                disabled={githubCreatingId === res.testCaseId || !!res.githubIssueUrl}
                                className="btn-secondary"
                                style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}
                            >
                                {res.githubIssueUrl ? 'Issue Created' : (githubCreatingId === res.testCaseId ? 'Creating...' : 'Create GH Issue')}
                            </button>
                        )}
                    </div>

                    <div style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                <span style={{ fontWeight: 800, color: 'var(--text-muted)', display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Execution Logs</span>
                                <pre style={{
                                    margin: 0,
                                    padding: '1rem',
                                    background: 'rgba(0,0,0,0.3)',
                                    borderRadius: '0.75rem',
                                    fontFamily: 'monospace',
                                    fontSize: '0.8rem',
                                    whiteSpace: 'pre-wrap',
                                    color: 'var(--text-primary)',
                                    border: '1px solid var(--glass-border)'
                                }}>{res.logs}</pre>
                            </div>

                            {res.githubIssueUrl && (
                                <div style={{ marginTop: '0.5rem' }}>
                                    <a
                                        href={res.githubIssueUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                    >
                                        View GitHub Issue →
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
