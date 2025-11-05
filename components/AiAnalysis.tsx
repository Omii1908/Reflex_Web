
import React, { useState, useCallback } from 'react';
import { getTripAnalysis } from '../services/geminiService';
import type { SensorData, TripContext } from '../types';
import { ZapIcon } from '../constants';

interface AiAnalysisProps {
  sensorData: SensorData;
  tripContext: TripContext;
  riskScore: number;
}

export const AiAnalysis: React.FC<AiAnalysisProps> = ({ sensorData, tripContext, riskScore }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleAnalysis = useCallback(async () => {
    setIsLoading(true);
    setError('');
    setAnalysis('');
    try {
      const result = await getTripAnalysis(sensorData, tripContext, riskScore);
      setAnalysis(result);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [sensorData, tripContext, riskScore]);

  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-300">AI Trip Analysis</h3>
        <button
          onClick={handleAnalysis}
          disabled={isLoading}
          className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {isLoading ? (
             <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <ZapIcon />
          )}
          {isLoading ? 'Analyzing...' : 'Generate Analysis'}
        </button>
      </div>

      {error && <p className="text-brand-red">{error}</p>}
      
      {analysis ? (
        <p className="text-gray-300 bg-gray-700/50 p-3 rounded-md italic">{analysis}</p>
      ) : (
        !isLoading && <p className="text-gray-400">Click "Generate Analysis" to get an AI-powered summary of the current trip status.</p>
      )}
    </div>
  );
};
