import React from 'react';

export interface ServiceItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  route: string;
}

interface ServiceCardProps {
  item: ServiceItem;
  onClick: (route: string) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ item, onClick }) => {
  return (
    <div 
      onClick={() => onClick(item.route)}
      className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/80 
                 hover:shadow-md hover:border-sky-400 hover:-translate-y-0.5 
                 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
    >
      <div>
        <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200">
          {item.icon}
        </div>
        <h3 className="font-bold text-slate-800 text-sm group-hover:text-sky-600 transition-colors">
          {item.title}
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          {item.description}
        </p>
      </div>

      <div className="mt-3 flex items-center text-[11px] font-semibold text-sky-600 group-hover:translate-x-1 transition-transform">
        <span>Open Service</span>
        <span className="ml-1">→</span>
      </div>
    </div>
  );
};