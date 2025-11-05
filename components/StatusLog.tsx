
import React from 'react';
import type { LogEntry } from '../types';

interface StatusLogProps {
  logEntries: LogEntry[];
}

const typeConfig = {
    info: { color: 'text-gray-400', icon: 'i' },
    warning: { color: 'text-brand-yellow', icon: '!' },
    alert: { color: 'text-brand-red', icon: '🚨' },
};

export const StatusLog: React.FC<StatusLogProps> = ({ logEntries }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg h-80">
      <h3 className="text-lg font-semibold text-gray-300 mb-4">System Log</h3>
      <div className="h-full overflow-y-auto pr-2">
        <ul className="space-y-2">
          {logEntries.map((entry, index) => {
            const {color, icon} = typeConfig[entry.type];
            return (
              <li key={index} className="flex items-start text-sm">
                <span className={`w-10 text-right mr-2 font-mono ${color}`}>{entry.time.toLocaleTimeString()}</span>
                <span className={`font-bold w-5 text-center ${color}`}>{icon}</span>
                <span className={`flex-1 ${color}`}>{entry.message}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
