
import React from 'react';

interface RiskMeterProps {
  riskScore: number;
  analysis: string;
  isLoading: boolean;
}

const RiskMeter: React.FC<RiskMeterProps> = ({ riskScore, analysis, isLoading }) => {
  const score = Math.min(Math.max(riskScore, 0), 100);
  const circumference = 2 * Math.PI * 90; // 2 * pi * r
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score > 75) return 'text-brand-danger';
    if (score > 40) return 'text-brand-warning';
    return 'text-brand-safe';
  };
  
  const getBGColor = () => {
    if (score > 75) return 'stroke-brand-danger';
    if (score > 40) return 'stroke-brand-warning';
    return 'stroke-brand-safe';
  };

  return (
    <div className="bg-brand-secondary p-6 rounded-2xl shadow-lg text-center flex flex-col items-center justify-center aspect-square">
        <h2 className="text-xl font-semibold text-gray-300 mb-4">Live Risk Meter</h2>
        <div className="relative w-52 h-52">
            <svg className="w-full h-full" viewBox="0 0 200 200">
                {/* Background circle */}
                <circle
                    className="text-gray-700"
                    strokeWidth="15"
                    stroke="currentColor"
                    fill="transparent"
                    r="90"
                    cx="100"
                    cy="100"
                />
                {/* Progress circle */}
                <circle
                    className={`${getBGColor()} transition-all duration-500 ease-in-out`}
                    strokeWidth="15"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="90"
                    cx="100"
                    cy="100"
                    transform="rotate(-90 100 100)"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                {isLoading ? (
                    <div className="animate-pulse text-gray-400">Loading...</div>
                ) : (
                    <>
                        <span className={`font-orbitron text-6xl font-bold ${getColor()}`}>
                            {score}
                        </span>
                        <span className="text-lg text-gray-400">%</span>
                    </>
                )}
            </div>
        </div>
        <div className="mt-4 h-12 flex items-center">
            <p className="text-gray-300 italic">
                {isLoading ? <span className="animate-pulse">Analyzing data...</span> : analysis}
            </p>
        </div>
    </div>
  );
};

export default RiskMeter;
