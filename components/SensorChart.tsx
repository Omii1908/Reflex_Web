import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { SensorReading } from '../types';

interface SensorChartProps {
  data: SensorReading[];
}

const HARD_BRAKING_THRESHOLD = -10; // m/s² on Y-axis
const SUDDEN_ACCEL_THRESHOLD = 10;  // m/s² on Y-axis
const SHARP_TURN_THRESHOLD = 2;     // rad/s on Z-axis (absolute)

// Custom dot renderer for highlighting events
const EventDot: React.FC<any> = (props) => {
    const { cx, cy, payload, dataKey } = props;

    // Do not render if the coordinates are invalid
    if (cx === null || cy === null) {
        return null;
    }

    // For the Accelerometer chart (Y-axis)
    if (dataKey === 'accelY') {
        if (payload.accelY <= HARD_BRAKING_THRESHOLD) {
            // Hard Braking event
            return <circle cx={cx} cy={cy} r={5} fill="#F43F5E" stroke="#111827" strokeWidth={1} aria-label="Hard braking event" />;
        }
        if (payload.accelY >= SUDDEN_ACCEL_THRESHOLD) {
            // Sudden Acceleration event
            return <circle cx={cx} cy={cy} r={5} fill="#4ADE80" stroke="#111827" strokeWidth={1} aria-label="Sudden acceleration event" />;
        }
    }

    // For the Gyroscope chart (Z-axis)
    if (dataKey === 'gyroZ') {
        if (Math.abs(payload.gyroZ) > SHARP_TURN_THRESHOLD) {
            // Sharp Turn event
            return <circle cx={cx} cy={cy} r={5} fill="#38BDF8" stroke="#111827" strokeWidth={1} aria-label="Sharp turn event" />;
        }
    }
    
    return null; // Render no dot for normal data points
};


const SensorChart: React.FC<SensorChartProps> = ({ data }) => {
  const chartData = data.map(d => ({
    time: new Date(d.timestamp).toLocaleTimeString(),
    accelX: d.accel.x,
    accelY: d.accel.y,
    accelZ: d.accel.z,
    gyroX: d.gyro.x,
    gyroY: d.gyro.y,
    gyroZ: d.gyro.z,
  }));
  
  const renderChart = (title: string, keys: {name: string, stroke: string}[], domain: [number, number]) => (
    <div className="h-64">
       <h4 className="text-lg font-semibold text-gray-300 mb-2">{title}</h4>
       <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
          <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
          <YAxis stroke="#9CA3AF" fontSize={12} domain={domain} />
          <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563' }} />
          <Legend wrapperStyle={{fontSize: "12px"}}/>
          {keys.map(k => {
            const hasCustomDot = k.name === 'accelY' || k.name === 'gyroZ';
            return <Line 
                key={k.name} 
                type="monotone" 
                dataKey={k.name} 
                stroke={k.stroke} 
                dot={hasCustomDot ? <EventDot /> : false} 
                activeDot={false}
                strokeWidth={2}
            />
          })}
          {title === 'Accelerometer (m/s²)' && <ReferenceLine y={9.8} label={{ value: 'Gravity', position: 'insideTopLeft', fill: '#9CA3AF', fontSize: 10 }} stroke="#9CA3AF" strokeDasharray="3 3" />}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )

  return (
    <div className="bg-brand-secondary p-4 md:p-6 rounded-2xl shadow-lg">
      <h3 className="text-xl font-semibold text-gray-300 mb-4">Sensor Data Visualization</h3>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {renderChart('Accelerometer (m/s²)', [
            {name: 'accelX', stroke: '#F43F5E'}, 
            {name: 'accelY', stroke: '#FACC15'},
            {name: 'accelZ', stroke: '#38BDF8'},
        ], [-40, 40])}
        {renderChart('Gyroscope (rad/s)', [
            {name: 'gyroX', stroke: '#F43F5E'}, 
            {name: 'gyroY', stroke: '#FACC15'},
            {name: 'gyroZ', stroke: '#38BDF8'},
        ], [-10, 10])}
      </div>
    </div>
  );
};

export default SensorChart;