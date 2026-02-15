import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { StatCard } from '@/components/common/StatCard';

interface ReportsTabProps {
    chartData: { name: string; value: number; color: string }[];
    coverageData: { name: string; count: number }[];
    traceability: string;
    stability: string;
    failures: string;
}

export const ReportsTab: React.FC<ReportsTabProps> = ({
    chartData,
    coverageData,
    traceability,
    stability,
    failures
}) => {
    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                <StatCard label="Traceability" value={traceability} color="indigo" />
                <StatCard label="Stability" value={stability} color="emerald" />
                <StatCard label="Failures" value={failures} color="rose" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div className="card" style={{ height: '320px', display: 'flex', flexDirection: 'column' }}>
                    <h5 style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1.5rem', letterSpacing: '0.1em' }}>Distribution Overview</h5>
                    <div style={{ flex: 1 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    innerRadius={70}
                                    outerRadius={95}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.3))' }} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ background: 'var(--bg-glass)', border: '1px solid var(--glass-border)', borderRadius: '0.5rem', color: 'var(--text-primary)' }}
                                    itemStyle={{ color: 'var(--text-secondary)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card" style={{ height: '320px', display: 'flex', flexDirection: 'column' }}>
                    <h5 style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1.5rem', letterSpacing: '0.1em' }}>Requirement Coverage</h5>
                    <div style={{ flex: 1 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={coverageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ background: 'var(--bg-glass)', border: '1px solid var(--glass-border)', borderRadius: '0.5rem' }}
                                />
                                <Bar dataKey="count" fill="var(--primary)" radius={[6, 6, 0, 0]} barSize={24} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};
