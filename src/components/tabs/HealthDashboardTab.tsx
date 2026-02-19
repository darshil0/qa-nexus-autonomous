import React from 'react';
import { Activity, Zap, Layers, Cpu, Clock, MousePointer2 } from 'lucide-react';
import type { OrchestrationMetrics } from '@/types';
import { StatCard } from '@/components/common/StatCard';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface HealthDashboardTabProps {
    metrics: OrchestrationMetrics;
}

export const HealthDashboardTab: React.FC<HealthDashboardTabProps> = ({ metrics }) => {
    const toolData = Object.entries(metrics.toolFrequency).map(([name, count]) => ({
        name,
        count
    })).sort((a, b) => b.count - a.count);

    const COLORS = ['#6366f1', '#a855f7', '#f43f5e', '#10b981', '#f59e0b'];

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <div style={{ padding: '0.5rem', borderRadius: '0.5rem', background: 'rgba(244, 63, 94, 0.1)', color: 'var(--accent)' }}>
                    <Activity size={20} />
                </div>
                <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>System Health & Orchestration Monitor</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Real-time diagnostics for recursive agentic loops and MCP tool usage.</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <StatCard
                    label="Tool Calls"
                    value={metrics.totalToolCalls.toString()}
                    icon={<MousePointer2 size={16} />}
                    color="indigo"
                />
                <StatCard
                    label="Avg Loop Depth"
                    value={metrics.averageLoopDepth.toString()}
                    icon={<Layers size={16} />}
                    color="purple"
                />
                <StatCard
                    label="Est. Tokens"
                    value={(metrics.totalTokensEstimated / 1000).toFixed(1) + 'k'}
                    icon={<Cpu size={16} />}
                    color="amber"
                />
                <StatCard
                    label="Avg Latency"
                    value={`${(metrics.latencyMs / 1000).toFixed(1)}s`}
                    icon={<Clock size={16} />}
                    color="emerald"
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
                <div className="card" style={{ minHeight: '350px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                        <Zap size={18} style={{ color: 'var(--primary)' }} />
                        <h4 style={{ fontSize: '0.875rem', fontWeight: 700 }}>MCP Tool Frequency</h4>
                    </div>

                    <div style={{ flex: 1, width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={toolData} layout="vertical" margin={{ left: 20, right: 30, top: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--text-muted)', fontSize: 11, fontWeight: 600 }}
                                    width={120}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                    contentStyle={{
                                        background: 'rgba(15, 23, 42, 0.9)',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: '0.75rem',
                                        fontSize: '12px'
                                    }}
                                />
                                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={24}>
                                    {toolData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>Loop Optimization Status</h4>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Resource Saturation</span>
                            <span style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--primary)' }}>{Math.min(100, (metrics.totalTokensEstimated / 50000) * 100).toFixed(0)}%</span>
                        </div>
                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${Math.min(100, (metrics.totalTokensEstimated / 50000) * 100)}%`, background: 'var(--primary)', boxShadow: '0 0 10px var(--primary)' }}></div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '0.5rem' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Reasoning Efficiency</span>
                            <span style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--success)' }}>{metrics.totalToolCalls > 0 ? (100 - (metrics.averageLoopDepth * 15)).toFixed(0) : '100'}%</span>
                        </div>
                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${metrics.totalToolCalls > 0 ? 100 - (metrics.averageLoopDepth * 15) : 100}%`, background: 'var(--success)', boxShadow: '0 0 10px var(--success)' }}></div>
                        </div>
                    </div>

                    <div style={{ marginTop: 'auto', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '1rem', border: '1px solid var(--glass-border)' }}>
                        <h5 style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Active Processes</h5>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div className={`pulse-${metrics.activeLoops > 0 ? 'success' : 'primary'}`} style={{ width: '8px', height: '8px', borderRadius: '50%', background: metrics.activeLoops > 0 ? 'var(--success)' : 'var(--primary)' }}></div>
                            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>{metrics.activeLoops} Active Agentic Loops</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
