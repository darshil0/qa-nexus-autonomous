import React from 'react';
import { Terminal } from 'lucide-react';

interface AgentThinkingLogProps {
    thinkingProcess: string;
}

export const AgentThinkingLog: React.FC<AgentThinkingLogProps> = ({ thinkingProcess }) => (
    <div className="card" style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--glass-border)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary)', fontSize: '0.7rem', fontWeight: 800, marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
            <Terminal size={14} />
            <span>Neural Engine Trace</span>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, var(--primary), transparent)', opacity: 0.3 }}></div>
        </div>
        <pre className="animate-pulse-glow" style={{
            color: '#94a3b8',
            fontSize: '0.8rem',
            fontFamily: 'monospace',
            lineHeight: '1.6',
            maxHeight: '240px',
            overflowY: 'auto',
            whiteSpace: 'pre-wrap',
            margin: 0,
            padding: '1rem',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '0.75rem',
            border: '1px solid rgba(255,255,255,0.05)'
        }}>
            {thinkingProcess || '> Waiting for neural synchronization...'}
        </pre>
    </div>
);
