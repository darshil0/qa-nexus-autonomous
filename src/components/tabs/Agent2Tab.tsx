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
        <div className="max-w-4xl mx-auto space-y-6">
            {highlightedReqId && (
                <div className="flex items-center justify-between bg-indigo-600 text-white p-4 rounded-xl shadow-lg animate-in fade-in slide-in-from-top-2">
                    <span className="text-sm font-bold flex items-center gap-2">
                        <Workflow size={16} /> Viewing scenarios for: {highlightedReqId}
                    </span>
                    <button onClick={() => setHighlightedReqId(null)} aria-label="Clear filter">
                        <X size={16} />
                    </button>
                </div>
            )}
            {filteredTestCases.map(tc => (
                <div
                    key={tc.id}
                    id={`tc-card-${tc.id}`}
                    className="bg-white rounded-2xl border shadow-sm overflow-hidden"
                >
                    <div className="px-6 py-4 bg-slate-50 border-b flex justify-between items-center">
                        <h4 className="font-bold text-slate-700">
                            {tc.id} - {tc.category}
                        </h4>
                        <div className="flex gap-2">
                            {tc.linkedRequirementIds.map(rid => (
                                <button
                                    key={rid}
                                    onClick={() => navigateToSpec(rid)}
                                    className={`text-[10px] font-bold px-2 py-1 rounded border transition-all ${rid === highlightedReqId
                                            ? 'bg-indigo-600 text-white border-indigo-700 shadow-md scale-105'
                                            : 'bg-white text-slate-400 hover:text-indigo-600'
                                        }`}
                                    aria-label={`Go to requirement ${rid}`}
                                >
                                    {rid}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="text-xs text-slate-500 italic">Pre: {tc.preconditions}</div>
                        <div className="space-y-2">
                            {tc.steps.map((s, i) => (
                                <div key={i} className="text-sm flex gap-3">
                                    <span className="text-slate-300 font-bold">{i + 1}.</span> {s}
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 p-4 bg-slate-900 text-indigo-400 rounded-xl text-sm font-bold flex items-center gap-2">
                            <ArrowRight size={14} /> {tc.expectedOutcomes}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
