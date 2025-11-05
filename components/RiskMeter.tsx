import React, { useState, useEffect, useRef } from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

interface RiskMeterProps {
  riskScore: number;
}

export const RiskMeter: React.FC<RiskMeterProps> = ({ riskScore }) => {
  const score = Math.min(100, Math.max(0, riskScore));
  let color = '#22c55e'; // green
  if (score > 40) color = '#f59e0b'; // yellow
  if (score > 75) color = '#ef4444'; // red

  const data = [{ name: 'Risk', value: score, fill: color }];

  const [displayScore, setDisplayScore] = useState(score);
  const prevScoreRef = useRef(score);
  // FIX: Initialize useRef with null and update the type to allow null.
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const startValue = prevScoreRef.current;
    const endValue = score;
    const duration = 800;
    let startTime: number;

    const animate = (timestamp: number) => {
        if (startTime === undefined) {
            startTime = timestamp;
        }

        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentAnimatedValue = startValue + (endValue - startValue) * progress;
        
        setDisplayScore(currentAnimatedValue);

        if (progress < 1) {
            animationFrameRef.current = requestAnimationFrame(animate);
        } else {
            // Update ref to the final value when animation completes
            prevScoreRef.current = endValue;
        }
    };

    // Cancel previous animation frame if a new score comes in
    if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
    }
    
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        // On cleanup, ensure the ref is the latest score for the next animation start
        prevScoreRef.current = score;
    };
}, [score]);


  return (
    <div className="bg-gray-800 rounded-lg p-4 flex flex-col items-center justify-center shadow-lg h-full min-h-[280px]">
      <h3 className="text-lg font-semibold text-gray-300 mb-2">Live Risk Meter</h3>
      <div className="w-full h-48 relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            innerRadius="70%"
            outerRadius="100%"
            data={data}
            startAngle={180}
            endAngle={0}
            barSize={20}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              background={{ fill: '#374151' }}
              dataKey="value"
              cornerRadius={10}
              isAnimationActive={true}
              animationDuration={800}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold" style={{ color, fontFamily: "'Orbitron', sans-serif" }}>
              {displayScore.toFixed(0)}
              <span className="text-3xl text-gray-400">%</span>
            </span>
            <span className="text-gray-400 font-medium mt-1">Accident Probability</span>
        </div>
      </div>
    </div>
  );
};