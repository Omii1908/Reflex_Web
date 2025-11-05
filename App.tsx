import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { RiskMeter } from './components/RiskMeter';
import { SensorChart } from './components/SensorChart';
import { InfoCard } from './components/InfoCard';
import { EmergencyContacts } from './components/EmergencyContacts';
import { StatusLog } from './components/StatusLog';
import { AiAnalysis } from './components/AiAnalysis';
import type { SensorData, TripContext, LogEntry } from './types';
import { AltitudeIcon, CarConditionIcon, CloudIcon, HistoryIcon, MapPinIcon, RoadIcon, SpeedometerIcon, TrafficIcon } from './constants';
import { fetchRealtimeData } from './services/apiService';

const App: React.FC = () => {
  const [riskScore, setRiskScore] = useState(5);
  const [sensorData, setSensorData] = useState<SensorData>({
    accelerometer: [],
    gyroscope: [],
  });
  const [tripContext, setTripContext] = useState<TripContext>({
    speed: 0,
    location: "Loading...",
    weather: "Loading...",
    traffic: "Light",
    roadType: "Highway",
    altitude: 0,
    accidentHistory: "Medium",
    carCondition: "Good",
  });
  const [status, setStatus] = useState<"monitoring" | "warning" | "alert">("monitoring");
  const [log, setLog] = useState<LogEntry[]>([{ time: new Date(), message: "System Initialized. Monitoring...", type: "info" }]);
  const [geolocationError, setGeolocationError] = useState<string>('');
  const tickCounter = useRef(0);

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeolocationError("Geolocation is not supported by your browser. Using default data.");
       setTripContext(prev => ({
          ...prev,
          location: "Delhi, India",
          weather: "Clear, 28°C",
          altitude: 216,
      }));
      return;
    }

    const fetchAndSetRealtimeData = async (lat: number, lon: number) => {
        try {
            const data = await fetchRealtimeData(lat, lon);
            setTripContext(prev => ({
                ...prev,
                location: data.location,
                weather: data.weather,
                altitude: Math.round(data.altitude),
            }));
        } catch (error: any) {
            setGeolocationError(error.message);
            // Revert to default values on API error
            setTripContext(prev => ({
                ...prev,
                location: "Delhi, India",
                weather: "Clear, 28°C",
                altitude: 216,
            }));
        }
    };
    
    addLogEntry("Requesting location for real-time data...", "info");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        addLogEntry("Location acquired. Fetching live data...", "info");
        fetchAndSetRealtimeData(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        const message = `Geolocation error: ${error.message}. Using default location.`;
        setGeolocationError(message);
        addLogEntry(message, "warning");
        // Fallback to default if user denies permission
        setTripContext(prev => ({
            ...prev,
            location: "Delhi, India",
            weather: "Clear, 28°C",
            altitude: 216,
        }));
      }
    );
  }, []);


  const addLogEntry = useCallback((message: string, type: "info" | "warning" | "alert") => {
    setLog(prevLog => [{ time: new Date(), message, type }, ...prevLog.slice(0, 9)]);
  }, []);

  const simulateDataTick = useCallback(() => {
    tickCounter.current += 1;
    
    let newRisk = riskScore;
    let newSpeed = tripContext.speed;
    let newCarCondition = tripContext.carCondition;
    
    let isHighRiskMoment = false;
    let eventLog = '';
    let eventType: 'info' | 'warning' = 'info';

    // Decide on a random driving event
    const eventRoll = Math.random();

    if (eventRoll < 0.04) { // 4% chance of hard brake
        isHighRiskMoment = true;
        const speedReduction = Math.min(newSpeed, Math.random() * 20 + 25); // reduce by 25-45 km/h
        newSpeed -= speedReduction;
        eventLog = `Hard brake applied (-${speedReduction.toFixed(0)} km/h).`;
        eventType = 'warning';
        newRisk = Math.min(100, newRisk + 25);
    } else if (eventRoll < 0.08) { // 4% chance of sudden acceleration
        isHighRiskMoment = true;
        const speedIncrease = Math.random() * 20 + 25; // increase by 25-45 km/h
        newSpeed += speedIncrease;
        eventLog = `Sudden acceleration detected (+${speedIncrease.toFixed(0)} km/h).`;
        eventType = 'warning';
        newRisk = Math.min(100, newRisk + 20);
    } else { // Normal driving
        // Gradual risk decay and speed change
        newRisk = Math.max(5, newRisk - 0.5);
        newSpeed += (Math.random() - 0.5) * 10; // Normal fluctuation
    }

    newSpeed = Math.max(0, Math.min(120, newSpeed));
    if(eventLog) {
      addLogEntry(eventLog, eventType);
    }
    
    const now = new Date();
    const newAccel = {
      time: `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
      x: (isHighRiskMoment ? (Math.random() - 0.5) * 20 : (Math.random() - 0.5) * 2),
      y: (isHighRiskMoment ? (Math.random() - 0.5) * 20 : (Math.random() - 0.5) * 2),
      z: 9.8 + (Math.random() - 0.5) * 1 + (isHighRiskMoment ? (Math.random() - 0.5) * 10 : 0),
    };

    const newGyro = {
      time: `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
      // Make sharp turns more likely to happen randomly
      x: (eventRoll >= 0.08 && eventRoll < 0.15 ? (Math.random() - 0.5) * 3 : (Math.random() - 0.5) * 0.5),
      y: (eventRoll >= 0.08 && eventRoll < 0.15 ? (Math.random() - 0.5) * 3 : (Math.random() - 0.5) * 0.5),
      z: (Math.random() - 0.5) * 0.5,
    };
    
    // Log sharp turns from gyro data
    const maxGyro = Math.max(Math.abs(newGyro.x), Math.abs(newGyro.y));
    if (maxGyro > 0.8) {
        addLogEntry(`Very sharp turn detected (gyro: ${maxGyro.toFixed(2)} rad/s).`, "warning");
        newRisk = Math.min(100, newRisk + 15);
    } else if (maxGyro > 0.4) {
        addLogEntry(`Sharp turn detected (gyro: ${maxGyro.toFixed(2)} rad/s).`, "info");
        newRisk = Math.min(100, newRisk + 5);
    }
    
    if (newRisk > 60 && Math.random() < 0.1) {
        newCarCondition = "Needs Check";
        addLogEntry("Vehicle sensor indicates potential issue.", "warning");
    }

    const hour = new Date().getHours();
    let newTraffic = "Light";
    if ((hour >= 7 && hour <= 10) || (hour >= 16 && hour <= 19)) {
        newTraffic = "Heavy";
    } else if (hour > 10 && hour < 16) {
        newTraffic = "Moderate";
    }
    if (newTraffic === "Heavy" && newRisk < 60) newRisk = Math.min(100, newRisk + 1);

    setRiskScore(parseFloat(newRisk.toFixed(2)));
    setTripContext(prev => ({ 
        ...prev, 
        speed: parseFloat(newSpeed.toFixed(0)),
        carCondition: newCarCondition,
        traffic: newTraffic,
    }));

    setSensorData(prev => ({
      accelerometer: [...prev.accelerometer.slice(-19), newAccel],
      gyroscope: [...prev.gyroscope.slice(-19), newGyro],
    }));

    if (tickCounter.current % 7 === 0) {
        addLogEntry(`Current speed: ${newSpeed.toFixed(0)} km/h.`, "info");
    }

    if (newRisk > 75) {
      if (status !== 'alert') {
        setStatus('alert');
        addLogEntry("ACCIDENT ALERT! Notifying emergency contacts.", "alert");
      }
    } else if (newRisk > 40) {
      if(status !== 'alert') setStatus('warning');
    } else {
      setStatus('monitoring');
    }

  }, [riskScore, tripContext, status, addLogEntry]);

  useEffect(() => {
    addLogEntry("Vehicle started.", "info");
    const interval = setInterval(simulateDataTick, 1500);
    return () => clearInterval(interval);
  }, [simulateDataTick]);


  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header status={status} />
         {geolocationError && (
            <div className="bg-yellow-500/20 text-yellow-300 text-center p-2 rounded-lg my-4 text-sm">
                {geolocationError}
            </div>
        )}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RiskMeter riskScore={riskScore} />
                <div className="bg-gray-800 rounded-lg p-4 flex flex-col justify-center shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-300 mb-4">Trip Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InfoCard icon={<SpeedometerIcon />} label="Speed" value={`${tripContext.speed} km/h`} />
                        <InfoCard icon={<MapPinIcon />} label="Location" value={tripContext.location} />
                        <InfoCard icon={<CloudIcon />} label="Weather" value={tripContext.weather} />
                        <InfoCard icon={<TrafficIcon />} label="Traffic" value={tripContext.traffic} />
                        <InfoCard icon={<RoadIcon />} label="Road Type" value={tripContext.roadType} />
                        <InfoCard icon={<AltitudeIcon />} label="Altitude" value={`${tripContext.altitude} m`} />
                        <InfoCard icon={<HistoryIcon />} label="Zone History" value={tripContext.accidentHistory} />
                        <InfoCard icon={<CarConditionIcon />} label="Car Condition" value={tripContext.carCondition} />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SensorChart title="Accelerometer (m/s²)" data={sensorData.accelerometer} keys={['x', 'y', 'z']} colors={['#ef4444', '#f59e0b', '#22c55e']} />
              <SensorChart title="Gyroscope (rad/s)" data={sensorData.gyroscope} keys={['x', 'y', 'z']} colors={['#3b82f6', '#8b5cf6', '#ec4899']} />
            </div>
             <AiAnalysis sensorData={sensorData} tripContext={tripContext} riskScore={riskScore} />
          </div>
          
          {/* Side Column */}
          <div className="lg:col-span-1 space-y-6">
            <StatusLog logEntries={log} />
            <EmergencyContacts />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;