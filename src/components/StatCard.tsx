import React from 'react';

export type StatCardColor = 'indigo' | 'emerald' | 'rose' | 'slate' | 'cyan' | 'amber';

interface StatCardProps {
    label: string;
    value: string;
    color?: StatCardColor;
}

const colorClassMap: Record<StatCardColor, string> = {
    indigo: 'text-indigo-600',
    emerald: 'text-emerald-600',
    rose: 'text-rose-600',
    slate: 'text-slate-600',
    cyan: 'text-cyan-600',
    amber: 'text-amber-600',
};

export const StatCard: React.FC<StatCardProps> = ({ label, value, color = 'indigo' }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-1">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <p className={`text-3xl font-black ${colorClassMap[color]}`}>{value}</p>
    </div>
);
