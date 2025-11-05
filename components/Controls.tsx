
import React from 'react';

interface ControlsProps {
  onStart: () => void;
  onStop: () => void;
  isMonitoring: boolean;
}

const Controls: React.FC<ControlsProps> = ({ onStart, onStop, isMonitoring }) => {
  return (
    <div className="bg-brand-secondary p-6 rounded-2xl shadow-lg">
        <h3 className="text-xl font-semibold text-gray-300 mb-4">System Control</h3>
        <div className="flex space-x-4">
            <button
                onClick={onStart}
                disabled={isMonitoring}
                className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-brand-safe/80 hover:bg-brand-safe disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
                Start Trip
            </button>
            <button
                onClick={onStop}
                disabled={!isMonitoring}
                className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-brand-danger/80 hover:bg-brand-danger disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
                Stop Trip
            </button>
        </div>
    </div>
  );
};

export default Controls;
