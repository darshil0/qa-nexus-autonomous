import React from 'react';
import { Circle, Map as MapIcon } from 'lucide-react';
import { ValidatedSpec, TestCase, ExecutionResult } from '@/types';

interface Agent1TabProps {
    validatedSpecs: ValidatedSpec[];
    testCasesByReq: Record<string, TestCase[]>;
    results: ExecutionResult[];
    highlightedReqId: string | null;
    navigateToTests: (reqId: string) => void;
}

export const Agent1Tab: React.FC<Agent1TabProps> = ({
    validatedSpecs,
    testCasesByReq,
    results,
    highlightedReqId,
    navigateToTests
}) => {
    const resMap = new Map<string, string>(results.map(r => [r.testCaseId, r.status]));

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {validatedSpecs.map(spec => {
                const associatedTests = testCasesByReq[spec.requirementId] || [];
                const isHighlighted = spec.requirementId === highlightedReqId;

                return (
                    <div
                        key={spec.requirementId}
                        id={`spec-${spec.requirementId}`}
                        className="card animate-fade-in"
                        style={{
                            border: isHighlighted ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
                            boxShadow: isHighlighted ? 'var(--shadow-glow)' : 'var(--shadow-sm)',
                            transform: isHighlighted ? 'scale(1.01)' : 'none',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    padding: '0.4rem 0.8rem',
                                    borderRadius: '0.5rem',
                                    background: 'rgba(99, 102, 241, 0.1)',
                                    color: 'var(--primary)',
                                    fontSize: '0.7rem',
                                    fontWeight: 800,
                                    letterSpacing: '0.05em'
                                }}>
                                    {spec.requirementId}
                                </div>
                                <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>{spec.title}</h4>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                {associatedTests.length > 0 && (
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        {associatedTests.map(tc => {
                                            const status = resMap.get(tc.id) || 'NOT_RUN';
                                            const color = status === 'PASS' ? 'var(--success)' : status === 'FAIL' ? 'var(--accent)' : 'rgba(255,255,255,0.1)';
                                            return (
                                                <div key={tc.id} title={`${tc.id}: ${status}`} style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }}></div>
                                            );
                                        })}
                                    </div>
                                )}
                                <button
                                    onClick={() => navigateToTests(spec.requirementId)}
                                    className="btn-secondary"
                                    style={{ padding: '0.5rem', borderRadius: '0.5rem' }}
                                    title="Trace to Tests"
                                >
                                    <MapIcon size={16} />
                                </button>
                            </div>
                        </div>

                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>{spec.description}</p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '1rem', border: '1px solid var(--glass-border)' }}>
                                <h5 style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
                                    Acceptance Criteria
                                </h5>
                                <ul style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {spec.acceptanceCriteria.map((ac, i) => (
                                        <li key={i}>{ac}</li>
                                    ))}
                                </ul>
                            </div>

                            {spec.ambiguities.length > 0 ? (
                                <div style={{ padding: '1rem', background: 'rgba(244, 63, 94, 0.05)', borderRadius: '1rem', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
                                    <h5 style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
                                        Detected Ambiguities
                                    </h5>
                                    <ul style={{ fontSize: '0.8rem', color: 'var(--accent)', paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', opacity: 0.9 }}>
                                        {spec.ambiguities.map((am, i) => (
                                            <li key={i}>{am}</li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '1rem', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ color: 'var(--success)', fontSize: '0.7rem', fontWeight: 800 }}>✓ SPECIFICATION VERIFIED</div>
                                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textAlign: 'center' }}>No ambiguities detected by Agent 1.</p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
