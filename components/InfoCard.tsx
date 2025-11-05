
import React from 'react';

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({ icon, label, value }) => {
  return (
    <div className="bg-gray-700/50 p-3 rounded-md flex items-center space-x-3">
      <div className="text-brand-yellow">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-semibold text-white">{value}</p>
      </div>
    </div>
  );
};
