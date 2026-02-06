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
import { StatCard } from '../StatCard';

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
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="grid grid-cols-3 gap-6">
                <StatCard label="Traceability" value={traceability} color="indigo" />
                <StatCard label="Stability" value={stability} color="emerald" />
                <StatCard label="Failures" value={failures} color="rose" />
            </div>
            <div className="grid grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl border shadow-sm h-64">
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={chartData}
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white p-8 rounded-3xl border shadow-sm h-64">
                    <ResponsiveContainer>
                        <BarChart data={coverageData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
