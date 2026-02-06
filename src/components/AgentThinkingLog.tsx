import React from 'react';
import { Terminal } from 'lucide-react';

interface AgentThinkingLogProps {
    thinkingProcess: string;
}

export const AgentThinkingLog: React.FC<AgentThinkingLogProps> = ({ thinkingProcess }) => (
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold mb-4 uppercase tracking-widest">
            <Terminal size={14} /> Agent Thinking log
        </div>
        <pre className="text-indigo-200 text-xs mono leading-relaxed opacity-80 max-h-48 overflow-y-auto whitespace-pre-wrap">
            {thinkingProcess}
        </pre>
    </div>
);
