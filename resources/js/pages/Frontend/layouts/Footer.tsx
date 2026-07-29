import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs mt-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h4 className="text-white font-bold text-sm mb-2">🏛️ MeroWard Portal</h4>
          <p className="text-[11px] leading-relaxed">
            Digital civic governance platform for seamless ward sifarish services, notices, and public archives.
          </p>
        </div>
        <div>
          <h4 className="text-white font-bold text-sm mb-2">Quick Links</h4>
          <ul className="space-y-1 text-[11px]">
            <li><a href="#services" className="hover:underline">Ward Fee Chart</a></li>
            <li><a href="#notices" className="hover:underline">Public Minutes & Agenda</a></li>
            <li><a href="#projects" className="hover:underline">Ward Projects Tracker</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold text-sm mb-2">Affiliation & License</h4>
          <p className="text-[11px] leading-relaxed">
            Under Guidance of Lumbini Technological University<br />
            © MeroWard 2083. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};