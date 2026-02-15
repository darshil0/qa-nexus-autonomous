import React from 'react';
import { Settings as SettingsIcon, BrainCircuit, Thermometer, IterationCcw, Zap } from 'lucide-react';
import type { AISettings } from '@/types';

interface SettingsTabProps {
    settings: AISettings;
    setSettings: (settings: AISettings) => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ settings, setSettings }) => {
    const updateSetting = <K extends keyof AISettings>(key: K, value: AISettings[K]) => {
        setSettings({ ...settings, [key]: value });
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <div style={{ padding: '0.5rem', borderRadius: '0.5rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>
                        <SettingsIcon size={18} />
                    </div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>AI Orchestration Settings</h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div className="card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                            <IterationCcw size={16} style={{ color: 'var(--primary)' }} />
                            <h4 style={{ fontSize: '0.875rem', fontWeight: 700 }}>Reasoning Iterations</h4>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                            Maximum number of tool-call cycles per agent task. Higher values allow deeper analysis.
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <input
                                type="range"
                                min="1"
                                max="5"
                                value={settings.maxIterations}
                                onChange={(e) => updateSetting('maxIterations', parseInt(e.target.value))}
                                style={{ flex: 1, accentColor: 'var(--primary)' }}
                            />
                            <span style={{ fontWeight: 800, color: 'var(--primary)', minWidth: '1.5rem' }}>{settings.maxIterations}</span>
                        </div>
                    </div>

                    <div className="card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                            <Thermometer size={16} style={{ color: 'var(--accent)' }} />
                            <h4 style={{ fontSize: '0.875rem', fontWeight: 700 }}>Temperature</h4>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                            Controls randomness. 0.0 is deterministic, 1.0 is highly creative/variable.
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={settings.temperature * 100}
                                onChange={(e) => updateSetting('temperature', parseInt(e.target.value) / 100)}
                                style={{ flex: 1, accentColor: 'var(--accent)' }}
                            />
                            <span style={{ fontWeight: 800, color: 'var(--accent)', minWidth: '1.5rem' }}>{settings.temperature.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="card" style={{ background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Zap size={18} style={{ color: settings.useFlashModel ? 'var(--success)' : 'var(--primary)' }} />
                            <div>
                                <h4 style={{ fontSize: '0.875rem', fontWeight: 700 }}>High-Performance Mode</h4>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    Use Gemini 1.5 Flash for all agents to prioritize speed over depth.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => updateSetting('useFlashModel', !settings.useFlashModel)}
                            style={{
                                width: '48px',
                                height: '24px',
                                borderRadius: '12px',
                                background: settings.useFlashModel ? 'var(--success)' : 'rgba(255,255,255,0.1)',
                                border: 'none',
                                position: 'relative',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <div style={{
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                background: 'white',
                                position: 'absolute',
                                top: '3px',
                                left: settings.useFlashModel ? '27px' : '3px',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }}></div>
                        </button>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <BrainCircuit size={16} />
                    <span>Settings are saved automatically to your browser session. Higher iteration counts may increase API latency.</span>
                </div>
            </div>
        </div>
    );
};
