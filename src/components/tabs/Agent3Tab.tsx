import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
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
    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {results.map(res => {
                const isPass = res.status === 'PASS';
                const accentColor = isPass ? 'var(--success)' : 'var(--accent)';

                return (
                    <div
                        key={res.testCaseId}
                        className="card animate-fade-in"
                        style={{ padding: 0, overflow: 'hidden', display: 'flex', borderLeft: `4px solid ${accentColor}` }}
                    >
                        <div
                            style={{
                                width: '120px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: `rgba(${isPass ? '16, 185, 129' : '244, 63, 94'}, 0.05)`,
                                gap: '0.75rem',
                                borderRight: '1px solid var(--glass-border)',
                                textAlign: 'center'
                            }}
                        >
                            <div style={{ color: accentColor }}>
                                {isPass ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
                            </div>
                            <span style={{ fontSize: '0.7rem', fontWeight: 900, color: accentColor, letterSpacing: '0.1em' }}>
                                {res.status}
                            </span>
                        </div>

                        <div style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h4 style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1rem' }}>{res.testCaseId}</h4>

                                {res.status === 'FAIL' && !res.githubIssueUrl && (
                                    <button
                                        onClick={() => handleGithubIssue(res)}
                                        disabled={githubCreatingId === res.testCaseId}
                                        className="btn-secondary"
                                        style={{ fontSize: '0.75rem', padding: '0.4rem 1rem' }}
                                    >
                                        {githubCreatingId === res.testCaseId ? 'CREATING...' : 'REPORT ISSUE'}
                                    </button>
                                )}

                                {res.githubIssueUrl && (
                                    <a
                                        href={res.githubIssueUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="badge"
                                        style={{ background: 'var(--success)', color: 'white', border: 'none' }}
                                    >
                                        LINKED ISSUE
                                    </a>
                                )}
                            </div>

                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)', fontWeight: 800 }}>VIRTUAL_MACHINE_LOGS</div>
                                <pre style={{
                                    background: 'rgba(0, 0, 0, 0.3)',
                                    color: isPass ? '#bbf7d0' : '#fecdd3',
                                    padding: '1.25rem',
                                    borderRadius: '0.75rem',
                                    fontSize: '0.8rem',
                                    margin: 0,
                                    maxHeight: '160px',
                                    overflowY: 'auto',
                                    whiteSpace: 'pre-wrap',
                                    border: '1px solid var(--glass-border)',
                                    fontFamily: 'monospace',
                                    lineHeight: '1.5'
                                }}>
                                    {res.logs}
                                </pre>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
