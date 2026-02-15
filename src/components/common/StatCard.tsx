import React from 'react';

export type StatCardColor = 'indigo' | 'emerald' | 'rose' | 'slate' | 'cyan' | 'amber' | 'purple';

interface StatCardProps {
    label: string;
    value: string;
    color?: StatCardColor;
    icon?: React.ReactNode;
}

const colorVarMap: Record<StatCardColor, string> = {
    indigo: 'var(--primary)',
    emerald: 'var(--success)',
    rose: 'var(--accent)',
    slate: 'var(--text-muted)',
    cyan: '#06b6d4',
    amber: '#f59e0b',
    purple: '#a855f7',
};

export const StatCard: React.FC<StatCardProps> = ({ label, value, color = 'indigo', icon }) => (
    <div className="card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem', transition: 'all 0.3s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            {icon && <div style={{ color: 'var(--text-muted)', opacity: 0.8 }}>{icon}</div>}
            <p style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.15em', margin: 0 }}>{label}</p>
        </div>
        <p style={{ fontSize: '2.5rem', fontWeight: 900, color: colorVarMap[color], margin: 0, textShadow: `0 0 20px rgba(${color === 'indigo' ? '99, 102, 241' : color === 'rose' ? '244, 63, 94' : '16, 185, 129'}, 0.2)` }}>{value}</p>
    </div>
);
