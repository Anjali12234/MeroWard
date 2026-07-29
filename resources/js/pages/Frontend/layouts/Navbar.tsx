import React from 'react';

interface NavbarProps {
  onNavigate: (route: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  return (
    <nav className="bg-slate-800 text-white text-xs font-medium border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 flex items-center space-x-6 h-10 overflow-x-auto">
        <button onClick={() => onNavigate('/')} className="hover:text-sky-300 transition whitespace-nowrap">Home</button>
        <button onClick={() => onNavigate('/services')} className="hover:text-sky-300 transition whitespace-nowrap">Services</button>
        <button onClick={() => onNavigate('/notices')} className="hover:text-sky-300 transition whitespace-nowrap">Notices</button>
        <button onClick={() => onNavigate('/projects')} className="hover:text-sky-300 transition whitespace-nowrap">Projects</button>
        <button onClick={() => onNavigate('/archives')} className="hover:text-sky-300 transition whitespace-nowrap">Public Archives</button>
        <button onClick={() => onNavigate('/contact')} className="hover:text-sky-300 transition whitespace-nowrap">Contact</button>
      </div>
    </nav>
  );
};