import React from 'react';

interface NoticeCardProps {
  title: string;
  actionText: string;
  subText?: string;
  linkText?: string;
  onClick?: () => void;
}

export const NoticeCard: React.FC<NoticeCardProps> = ({ title, actionText, subText, linkText, onClick }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex justify-between items-start">
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <span className="text-amber-500 text-lg">🔔</span>
        <h4 className="font-bold text-slate-800 text-xs">{title}</h4>
      </div>
      {linkText && <p className="text-[11px] text-sky-600 font-medium cursor-pointer hover:underline">{linkText}</p>}
      {subText && <p className="text-[11px] text-slate-500">{subText}</p>}
      <button 
        onClick={onClick}
        className="bg-sky-800 hover:bg-sky-900 text-white text-[11px] px-3 py-1 rounded-md font-medium transition"
      >
        {actionText}
      </button>
    </div>
    <span className="bg-emerald-500 text-white text-xs p-1.5 rounded-full cursor-pointer hover:bg-emerald-600 transition" title="WhatsApp Notice">
      💬
    </span>
  </div>
);