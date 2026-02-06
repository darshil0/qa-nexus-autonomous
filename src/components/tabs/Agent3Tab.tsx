import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { ExecutionResult } from '@/types';

interface Agent3TabProps {
    results: ExecutionResult[];
    handleGithubIssue: (res: ExecutionResult) => void;
    githubCreatingId: string | null;
}

export const Agent3Tab: React.FC<Agent3TabProps> = ({
    results,
    handleGithubIssue,
    githubCreatingId
}) => {
    return (
        <div className="max-w-4xl mx-auto space-y-4">
            {results.map(res => (
                <div
                    key={res.testCaseId}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex"
                >
                    <div
                        className={`w-32 flex flex-col items-center justify-center ${res.status === 'PASS' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                            }`}
                    >
                        {res.status === 'PASS' ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
                        <span className="text-[10px] font-black uppercase tracking-widest mt-2">
                            {res.status}
                        </span>
                    </div>
                    <div className="flex-1 p-6 space-y-4">
                        <div className="flex justify-between items-start">
                            <h4 className="font-bold">{res.testCaseId}</h4>
                            {res.status === 'FAIL' && !res.githubIssueUrl && (
                                <button
                                    onClick={() => handleGithubIssue(res)}
                                    disabled={githubCreatingId === res.testCaseId}
                                    className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
                                    aria-label={`Report failure for ${res.testCaseId}`}
                                >
                                    {githubCreatingId === res.testCaseId ? '...' : 'Report'}
                                </button>
                            )}
                            {res.githubIssueUrl && (
                                <a
                                    href={res.githubIssueUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-emerald-600 text-xs font-bold underline hover:text-emerald-700"
                                >
                                    Linked Issue
                                </a>
                            )}
                        </div>
                        <pre className="bg-slate-950 text-emerald-400 p-4 rounded-xl text-xs mono max-h-32 overflow-y-auto whitespace-pre-wrap">
                            {res.logs}
                        </pre>
                    </div>
                </div>
            ))}
        </div>
    );
};
