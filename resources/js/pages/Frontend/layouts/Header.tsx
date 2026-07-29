import React, { useState } from 'react';

interface HeaderProps {
  onNavigate: (route: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const [language, setLanguage] = useState<string>('English');

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('/')}>
          <div className="w-10 h-10 bg-sky-700 text-white rounded-full flex items-center justify-center font-bold text-lg">
            🏛️
          </div>
          <span className="text-2xl font-bold text-sky-800 tracking-tight">MeroWard</span>
        </div>

        {/* Profile & Language Controls */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => onNavigate('/register')}
            className="text-xs bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 rounded-md font-semibold transition"
          >
            Register Citizen
          </button>

          <div className="flex items-center space-x-2 border-l border-r px-4 border-slate-200 cursor-pointer" onClick={() => onNavigate('/profile')}>
            <div className="w-8 h-8 rounded-full bg-slate-300 overflow-hidden">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Anjali" 
                alt="Profile Avatar" 
                className="w-full h-full object-cover" 
              />
            </div>
            <span className="text-xs font-semibold text-slate-700 hidden sm:inline">Profile</span>
          </div>
          
          <select 
            value={language} 
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setLanguage(e.target.value)}
            className="text-xs bg-sky-800 text-white px-3 py-1.5 rounded-md font-medium outline-none cursor-pointer"
          >
            <option value="English">English</option>
            <option value="Nepali">नेपाली</option>
          </select>
        </div>
      </div>
    </header>
  );
};