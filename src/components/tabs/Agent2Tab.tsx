import React from 'react';
import { Workflow, X, ArrowRight } from 'lucide-react';
import { TestCase } from '@/types';

interface Agent2TabProps {
    filteredTestCases: TestCase[];
    highlightedReqId: string | null;
    setHighlightedReqId: (val: string | null) => void;
    navigateToSpec: (reqId: string) => void;
}

export const Agent2Tab: React.FC<Agent2TabProps> = ({
    filteredTestCases,
    highlightedReqId,
    setHighlightedReqId,
    navigateToSpec
}) => {
    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {highlightedReqId && (
                <div className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyItems: 'space-between', background: 'var(--primary)', color: 'white', padding: '1rem 1.5rem', borderRadius: '1rem', boxShadow: 'var(--shadow-glow)' }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Workflow size={18} />
                        <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>SCENARIOS FILTERED BY: {highlightedReqId}</span>
                    </div>
                    <button onClick={() => setHighlightedReqId(null)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', cursor: 'pointer', padding: '0.25rem', borderRadius: '50%', display: 'flex' }}>
                        <X size={16} />
                    </button>
                </div>
            )}

            {filteredTestCases.map(tc => (
                <div key={tc.id} id={`tc-card-${tc.id}`} className="card animate-fade-in" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '1.25rem 1.5rem', background: 'rgba(255, 255, 255, 0.05)', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--primary)', background: 'rgba(99, 102, 241, 0.1)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>{tc.category.toUpperCase()}</span>
                            <h4 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>{tc.id}</h4>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {tc.linkedRequirementIds.map(rid => (
                                <button
                                    key={rid}
                                    onClick={() => navigateToSpec(rid)}
                                    className="badge"
                                    style={{
                                        cursor: 'pointer',
                                        background: rid === highlightedReqId ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                        color: rid === highlightedReqId ? 'white' : 'var(--text-muted)',
                                        border: '1px solid var(--glass-border)'
                                    }}
                                >
                                    {rid}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ padding: '1.5rem' }}>
                        {tc.preconditions && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.2)', padding: '0.75rem 1rem', borderRadius: '0.75rem', marginBottom: '1.5rem', borderLeft: '3px solid var(--primary)' }}>
                                <span style={{ fontWeight: 800, color: 'var(--text-secondary)', marginRight: '0.5rem' }}>PRECONDITIONS:</span>
                                {tc.preconditions}
                            </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            {tc.steps.map((s, i) => (
                                <div key={i} style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                    <span style={{ color: 'var(--primary)', fontWeight: 800, minWidth: '1.5rem' }}>{String(i + 1).padStart(2, '0')}</span>
                                    <p style={{ margin: 0 }}>{s}</p>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(168, 85, 247, 0.05)', border: '1px solid rgba(168, 85, 247, 0.2)', borderRadius: '1rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div style={{ padding: '0.4rem', borderRadius: '0.5rem', background: 'var(--accent)', color: 'white' }}>
                                <ArrowRight size={14} />
                            </div>
                            <div>
                                <h5 style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Expected Outcome</h5>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600, margin: 0 }}>{tc.expectedOutcomes}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
