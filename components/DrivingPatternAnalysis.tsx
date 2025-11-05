
import React from 'react';
import { DrivingAnalysis } from '../types';

interface DrivingPatternAnalysisProps {
  onAnalyze: () => void;
  analysis: DrivingAnalysis | null;
  isAnalyzing: boolean;
  isMonitoring: boolean;
  historyLength: number;
}

const AnalysisIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const BrakeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-warning" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>;
const AccelIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-safe" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" /></svg>;
const TurnIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-accent" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>;
const LightbulbIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline" viewBox="0 0 20 20" fill="currentColor"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.657a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 14.95a1 1 0 001.414 1.414l.707-.707a1 1 0 00-1.414-1.414l-.707.707zM10 18a1 1 0 01-1-1v-1a1 1 0 112 0v1a1 1 0 01-1 1zM4.343 5.657a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM2 10a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1zM14.95 14.95a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707z" /><path d="M10 6a4 4 0 100 8 4 4 0 000-8z" /></svg>;

const DrivingPatternAnalysis: React.FC<DrivingPatternAnalysisProps> = ({ onAnalyze, analysis, isAnalyzing, isMonitoring, historyLength }) => {
  const canAnalyze = !isMonitoring && historyLength >= 10;
  
  const renderContent = () => {
    if (isAnalyzing) {
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-gray-400">
          <svg className="animate-spin h-8 w-8 text-brand-accent mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="font-semibold">Analyzing driving patterns...</p>
        </div>
      );
    }
    if (analysis) {
        return (
            <div className="space-y-4">
                <div>
                    <h4 className="font-semibold text-gray-300 mb-3">Key Events Detected</h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="bg-gray-700/50 p-3 rounded-lg">
                            <AccelIcon />
                            <p className="text-2xl font-bold font-orbitron">{analysis.suddenAccelerationEvents}</p>
                            <p className="text-xs text-gray-400">Sudden Accelerations</p>
                        </div>
                        <div className="bg-gray-700/50 p-3 rounded-lg">
                            <BrakeIcon />
                            <p className="text-2xl font-bold font-orbitron">{analysis.hardBrakingEvents}</p>
                            <p className="text-xs text-gray-400">Hard Braking</p>
                        </div>
                        <div className="bg-gray-700/50 p-3 rounded-lg">
                            <TurnIcon />
                            <p className="text-2xl font-bold font-orbitron">{analysis.sharpTurnEvents}</p>
                            <p className="text-xs text-gray-400">Sharp Turns</p>
                        </div>
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-300 mb-2">AI Summary</h4>
                    <p className="text-sm text-gray-400 italic">"{analysis.summary}"</p>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-300 mb-2">Recommendations</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                        {analysis.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start">
                                <LightbulbIcon />
                                <span>{rec}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        )
    }
    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[200px]">
            <AnalysisIcon />
            <p className="text-gray-400 mt-4 mb-4 text-center">Analyze the completed trip's sensor data for driving patterns.</p>
            <button
                onClick={onAnalyze}
                disabled={!canAnalyze || isAnalyzing}
                className="w-full max-w-xs py-3 px-4 rounded-lg font-semibold text-white bg-brand-accent/80 hover:bg-brand-accent disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
                Analyze Trip History
            </button>
            {!canAnalyze && <p className="text-xs text-gray-500 mt-2">
                {isMonitoring ? "Stop the current trip to enable analysis." : "A minimum of 10 data points is required."}
            </p>}
        </div>
    );
  }

  return (
    <div className="bg-brand-secondary p-4 md:p-6 rounded-2xl shadow-lg">
      <h3 className="text-xl font-semibold text-gray-300 mb-4">Trip Pattern Analysis</h3>
      {renderContent()}
    </div>
  );
};

export default DrivingPatternAnalysis;
