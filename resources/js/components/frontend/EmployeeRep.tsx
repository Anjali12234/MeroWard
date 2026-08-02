import React from 'react';

export interface WardRepCardProps {
  /** Display name of the representative or section header */
  title?: string;
 
  subtitle?: string;
  /** Image source URL for the avatar */
  image?: string;
  /** Alt text for the avatar image */
  avatarAlt?: string;
  /** Optional click handler */
  onClick?: () => void;
  /** Additional custom class names for outer container */
  className?: string;
}

export const EmployeeRep: React.FC<WardRepCardProps> = ({
  title = "Current Ward Reps",
  subtitle = "Current Ward Reps Expanded",
  image = "https://api.dicebear.com/7.x/avataaars/svg?seed=Rep1",
  avatarAlt = "Representative avatar",
  onClick,
  className = "",
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        flex items-center space-x-3 p-2 mb-2
        bg-slate-50 hover:bg-sky-50 
        rounded-xl border border-slate-100 
        transition duration-150 ease-in-out cursor-pointer
        ${className}
      `.trim()}
    >
      <img
        src={image}
        alt={avatarAlt}
        className="w-10 h-10 rounded-full border border-slate-200 bg-slate-200 object-cover flex-shrink-0"
      />
      <div className="min-w-0 flex-1">
        <h4 className="font-bold text-slate-800 text-xs truncate">
          {title}
        </h4>
        <p className="text-[10px] text-slate-500 truncate">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default EmployeeRep;