import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { TimeSeriesDataPoint } from '../types';

interface SensorChartProps {
  title: string;
  data: TimeSeriesDataPoint[];
  keys: Array<'x' | 'y' | 'z'>;
  colors: string[];
}

export const SensorChart: React.FC<SensorChartProps> = ({ title, data, keys, colors }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-300 mb-4">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} />
            <YAxis stroke="#9ca3af" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '0.5rem',
              }}
              labelStyle={{ color: '#d1d5db' }}
            />
            <Legend />
            {keys.map((key, index) => (
              <Line 
                key={key} 
                type="monotone" 
                dataKey={key} 
                stroke={colors[index % colors.length]} 
                strokeWidth={2} 
                dot={false}
                isAnimationActive={true}
                animationDuration={500}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};