import React from 'react';

interface NavBtnProps {
    icon?: React.ReactNode;
    label: string;
    active?: boolean;
    onClick?: () => void;
    disabled?: boolean;
}

export const NavBtn: React.FC<NavBtnProps> = ({ icon, label, active = false, onClick, disabled = false }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`nav-item ${active ? 'active' : ''}`}
        style={{ width: '100%', border: 'none', background: 'none', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.3 : 1 }}
    >
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {icon}
            <span style={{ fontWeight: 600 }}>{label}</span>
        </span>
    </button>
);
