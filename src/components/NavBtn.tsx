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
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${active ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'} ${disabled ? 'opacity-25' : ''}`}
    >
        {icon} {label}
    </button>
);
