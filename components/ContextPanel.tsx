
import React, { useState, useEffect, useRef } from 'react';
import { TripData, TrafficData, Location } from '../types';
import { getTrafficConditions } from '../services/trafficService';

interface ContextPanelProps {
  data: TripData | null;
  isMonitoring: boolean;
}

const InfoItem: React.FC<{ icon: React.ReactNode; label: string; value: string | number }> = ({ icon, label, value }) => (
    <div className="flex items-center space-x-3">
        <div className="bg-gray-700 p-2 rounded-full">{icon}</div>
        <div>
            <p className="text-sm text-gray-400">{label}</p>
            <p className="text-lg font-semibold">{value}</p>
        </div>
    </div>
);

const SpeedIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" /></svg>;
const WeatherIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201-4.459 4 4 0 117.898 3.055 5.5 5.5 0 011.303 1.404zM12 4a4 4 0 100 8 4 4 0 000-8z" clipRule="evenodd" /></svg>;
const RoadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4a1 1 0 00-1 1v1a1 1 0 002 0V5a1 1 0 00-1-1zm12 0a1 1 0 00-1 1v1a1 1 0 002 0V5a1 1 0 00-1-1zM4 10a1 1 0 00-1 1v1a1 1 0 002 0v-1a1 1 0 00-1-1zm12 0a1 1 0 00-1 1v1a1 1 0 002 0v-1a1 1 0 00-1-1zM10 10a1 1 0 00-1 1v1a1 1 0 002 0v-1a1 1 0 00-1-1zM4 16a1 1 0 00-1 1v1a1 1 0 002 0v-1a1 1 0 00-1-1zm12 0a1 1 0 00-1 1v1a1 1 0 002 0v-1a1 1 0 00-1-1zm-6 0a1 1 0 00-1 1v1a1 1 0 002 0v-1a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;

const TrafficStatusIndicator: React.FC<{ condition: TrafficData['condition'] | null }> = ({ condition }) => {
    const baseClasses = "w-3 h-3 rounded-full mr-2";
    let colorClass = "bg-gray-500";
    let label = "Unknown";
    
    if (condition === 'Flowing') {
        colorClass = "bg-brand-safe animate-pulse";
        label = "Flowing";
    } else if (condition === 'Slow') {
        colorClass = "bg-brand-warning";
        label = "Slow";
    } else if (condition === 'Congested') {
        colorClass = "bg-brand-danger";
        label = "Congested";
    }

    return (
        <div className="flex items-center">
            <div className={`${baseClasses} ${colorClass}`}></div>
            <p className="text-lg font-semibold">{label}</p>
        </div>
    );
};

const ContextPanel: React.FC<ContextPanelProps> = ({ data, isMonitoring }) => {
  const [traffic, setTraffic] = useState<TrafficData | null>(null);
  const locationRef = useRef<Location | null>(null);

  // Keep the location ref up-to-date without re-triggering the main effect
  useEffect(() => {
    locationRef.current = data?.location ?? null;
  }, [data]);

  useEffect(() => {
    let intervalId: number | null = null;

    const fetchTraffic = async () => {
      if (locationRef.current) {
        try {
          const trafficData = await getTrafficConditions(locationRef.current);
          setTraffic(trafficData);
        } catch (error) {
          console.error("Failed to fetch traffic conditions:", error);
        }
      }
    };

    if (isMonitoring) {
      fetchTraffic(); // Fetch immediately on start
      intervalId = window.setInterval(fetchTraffic, 3000); // Poll every 3 seconds
    } else {
      setTraffic(null); // Clear data when monitoring stops
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isMonitoring]);

  return (
    <div className="bg-brand-secondary p-6 rounded-2xl shadow-lg h-full flex flex-col">
      <h3 className="text-xl font-semibold text-gray-300 mb-4">Trip Context</h3>
      <div className="space-y-4 flex-grow">
        <InfoItem icon={<SpeedIcon />} label="Current Speed" value={data ? `${data.speed.toFixed(0)} km/h` : 'N/A'} />
        <InfoItem icon={<WeatherIcon />} label="Weather" value={data?.context.weather || 'N/A'} />
        <InfoItem icon={<RoadIcon />} label="Road Type" value={data?.context.roadClass || 'N/A'} />
      </div>
       <div className="border-t border-gray-700 mt-4 pt-4">
        <h4 className="text-lg font-semibold text-gray-300 mb-3">Live Traffic</h4>
        { isMonitoring ? (
            traffic ? (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-400">Condition</p>
                        <TrafficStatusIndicator condition={traffic.condition} />
                    </div>
                     <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-400">Avg. Area Speed</p>
                        <p className="text-lg font-semibold">{traffic.averageSpeed} km/h</p>
                    </div>
                     <p className="text-xs text-gray-500 italic text-center pt-2">{traffic.description}</p>
                </div>
            ) : (
                 <div className="flex items-center justify-center text-gray-500 text-sm h-full min-h-[80px]">
                    <p>Fetching traffic data...</p>
                </div>
            )
        ) : (
             <div className="flex items-center justify-center text-gray-500 text-sm h-full min-h-[80px]">
                <p>Start monitoring to see live traffic.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ContextPanel;
