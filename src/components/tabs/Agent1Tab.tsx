import React from 'react';
import { Circle, Map as MapIcon } from 'lucide-react';
import { ValidatedSpec, TestCase, ExecutionResult } from '@/types';

interface Agent1TabProps {
    validatedSpecs: ValidatedSpec[];
    testCasesByReq: Record<string, TestCase[]>;
    results: ExecutionResult[];
    highlightedReqId: string | null;
    navigateToTests: (reqId: string) => void;
}

export const Agent1Tab: React.FC<Agent1TabProps> = ({
    validatedSpecs,
    testCasesByReq,
    results,
    highlightedReqId,
    navigateToTests
}) => {
    const resMap = new Map<string, string>(results.map(r => [r.testCaseId, r.status]));

    return (
        <div className="max-w-4xl mx-auto space-y-4">
            {validatedSpecs.map(spec => {
                const associatedTests = testCasesByReq[spec.requirementId] || [];

                return (
                    <div
                        key={spec.requirementId}
                        id={`spec-${spec.requirementId}`}
                        className={`bg-white p-6 rounded-2xl border transition-all ${spec.requirementId === highlightedReqId
                                ? 'border-indigo-500 ring-4 ring-indigo-50 shadow-lg'
                                : 'border-slate-200 shadow-sm'
                            }`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-start gap-4">
                                <div>
                                    <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md uppercase tracking-wider">
                                        {spec.requirementId}
                                    </span>
                                    <h4 className="text-lg font-bold mt-2">{spec.title}</h4>
                                </div>
                                {associatedTests.length > 0 && (
                                    <div className="flex gap-1 mt-2.5">
                                        {associatedTests.map(tc => {
                                            const status = resMap.get(tc.id) || 'NOT_RUN';
                                            const colorClass =
                                                status === 'PASS'
                                                    ? 'text-emerald-500'
                                                    : status === 'FAIL'
                                                        ? 'text-rose-500'
                                                        : 'text-slate-200';
                                            return (
                                                <span key={tc.id} title={`${tc.id}: ${status}`} className="inline-flex">
                                                    <Circle size={10} fill="currentColor" className={colorClass} />
                                                </span>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => navigateToTests(spec.requirementId)}
                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                aria-label={`View tests for ${spec.requirementId}`}
                            >
                                <MapIcon size={18} />
                            </button>
                        </div>
                        <p className="text-sm text-slate-500 mb-4">{spec.description}</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <h5 className="text-[10px] font-bold text-slate-400 uppercase mb-2">
                                    Acceptance Criteria
                                </h5>
                                <ul className="text-xs space-y-1 list-disc list-inside">
                                    {spec.acceptanceCriteria.map((ac, i) => (
                                        <li key={i}>{ac}</li>
                                    ))}
                                </ul>
                            </div>
                            {spec.ambiguities.length > 0 && (
                                <div className="p-4 bg-rose-50 rounded-xl border border-rose-100">
                                    <h5 className="text-[10px] font-bold text-rose-400 uppercase mb-2"> Ambiguities </h5>
                                    <ul className="text-xs space-y-1 list-inside text-rose-700">
                                        {spec.ambiguities.map((am, i) => (
                                            <li key={i}>• {am}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
