import React from 'react';

export type StatCardColor = 'indigo' | 'emerald' | 'rose' | 'slate' | 'cyan' | 'amber';

interface StatCardProps {
    label: string;
    value: string;
    color?: StatCardColor;
}

const colorVarMap: Record<StatCardColor, string> = {
    indigo: 'var(--primary)',
    emerald: 'var(--success)',
    rose: 'var(--accent)',
    slate: 'var(--text-muted)',
    cyan: '#06b6d4',
    amber: '#f59e0b',
};

export const StatCard: React.FC<StatCardProps> = ({ label, value, color = 'indigo' }) => (
    <div className="card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem', transition: 'all 0.3s ease' }}>
        <p style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.15em', margin: 0 }}>{label}</p>
        <p style={{ fontSize: '2.5rem', fontWeight: 900, color: colorVarMap[color], margin: 0, textShadow: `0 0 20px rgba(${color === 'indigo' ? '99, 102, 241' : color === 'rose' ? '244, 63, 94' : '16, 185, 129'}, 0.2)` }}>{value}</p>
    </div>
);
