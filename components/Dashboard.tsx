
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TripData, SensorReading, EmergencyContact, Location as LocationType, DrivingAnalysis } from '../types';
import { SENSOR_UPDATE_INTERVAL_MS, RISK_ALERT_THRESHOLD, INITIAL_EMERGENCY_CONTACTS } from '../constants';
import { generateSensorData, resetSimulation } from '../services/sensorService';
import { getRiskAssessment, RiskAssessment, getDrivingPatternAnalysis } from '../services/geminiService';
import RiskMeter from './RiskMeter';
import SensorChart from './SensorChart';
import ContextPanel from './ContextPanel';
import EmergencyContacts from './EmergencyContacts';
import Controls from './Controls';
import AlertModal from './AlertModal';
import MapView from './MapView';
import DrivingPatternAnalysis from './DrivingPatternAnalysis';

const Dashboard: React.FC = () => {
    const [isMonitoring, setIsMonitoring] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isAlerting, setIsAlerting] = useState(false);
    const [currentData, setCurrentData] = useState<TripData | null>(null);
    const [sensorHistory, setSensorHistory] = useState<SensorReading[]>([]);
    const [risk, setRisk] = useState<RiskAssessment>({ riskScore: 0, analysis: 'System Idle' });
    const [contacts] = useState<EmergencyContact[]>(INITIAL_EMERGENCY_CONTACTS);
    const [location, setLocation] = useState<LocationType | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [isSharingLocation, setIsSharingLocation] = useState(false);

    // New state for driving pattern analysis
    const [drivingAnalysis, setDrivingAnalysis] = useState<DrivingAnalysis | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const intervalRef = useRef<number | null>(null);

    const stopMonitoring = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setIsMonitoring(false);
        setIsSharingLocation(false); // Turn off location sharing when trip stops
        // Do not clear history so it can be analyzed
        // setSensorHistory([]); 
        setCurrentData(null);
        setRisk({ riskScore: 0, analysis: 'Monitoring stopped. You can now analyze the trip.' });
        resetSimulation();
    }, []);

    const startMonitoring = () => {
        stopMonitoring();
        setIsMonitoring(true);
        setIsLoading(true);
        setIsSharingLocation(false); // Reset sharing status for new trip
        // Clear previous trip data
        setSensorHistory([]);
        setDrivingAnalysis(null);

        intervalRef.current = window.setInterval(async () => {
            const newData = generateSensorData(location);
            setCurrentData(newData);
            setSensorHistory(prev => [...prev.slice(-49), { timestamp: newData.timestamp, accel: newData.accel, gyro: newData.gyro }]);
            
            try {
                const assessment = await getRiskAssessment(newData);
                
                setRisk(assessment);

                if (assessment.riskScore > RISK_ALERT_THRESHOLD) {
                    setIsAlerting(true);
                }
            } catch(e) {
                console.error("Failed to get AI assessment", e);
                setRisk({ riskScore: 0, analysis: 'AI service unavailable.' });
            } finally {
                setIsLoading(false);
            }
        }, SENSOR_UPDATE_INTERVAL_MS);
    };

    const handleAnalyzeTrip = async () => {
        if (sensorHistory.length < 10) return;
        setIsAnalyzing(true);
        setDrivingAnalysis(null);
        try {
            const analysisResult = await getDrivingPatternAnalysis(sensorHistory);
            setDrivingAnalysis(analysisResult);
        } catch (error) {
            console.error("Failed to analyze trip", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleToggleLocationSharing = () => {
        if (!isMonitoring) return;
        const willBeSharing = !isSharingLocation;
        setIsSharingLocation(willBeSharing);
        // In a real application, this would trigger a service to start/stop sharing.
        console.log(`Real-time location sharing has been ${willBeSharing ? 'ENABLED' : 'DISABLED'}.`);
    };
    
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
                setLocationError(null);
            },
            (error) => {
                console.error("Geolocation error:", error);
                setLocationError("Geolocation is disabled. Using default location.");
                setLocation({ latitude: 28.6139, longitude: 77.2090 });
            }
        );
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    const handleCancelAlert = () => {
        setIsAlerting(false);
    };

    const handleAlertConfirm = () => {
        setIsAlerting(false);
        stopMonitoring();
        alert("Emergency contacts have been notified!");
    };

    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
            <AlertModal
                isOpen={isAlerting}
                onCancel={handleCancelAlert}
                onConfirm={handleAlertConfirm}
                riskScore={risk.riskScore}
                location={currentData?.location}
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-1 space-y-6">
                    <RiskMeter riskScore={risk.riskScore} analysis={risk.analysis} isLoading={isLoading && isMonitoring} />
                    <Controls onStart={startMonitoring} onStop={stopMonitoring} isMonitoring={isMonitoring} />
                    <EmergencyContacts 
                        contacts={contacts} 
                        isSharingLocation={isSharingLocation}
                        onToggleShare={handleToggleLocationSharing}
                        isMonitoring={isMonitoring}
                    />
                </div>
                
                {/* Right Column */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ContextPanel data={currentData} isMonitoring={isMonitoring} />
                         <MapView location={currentData?.location} error={locationError}/>
                    </div>
                    <SensorChart data={sensorHistory} />
                    <DrivingPatternAnalysis 
                        onAnalyze={handleAnalyzeTrip}
                        analysis={drivingAnalysis}
                        isAnalyzing={isAnalyzing}
                        isMonitoring={isMonitoring}
                        historyLength={sensorHistory.length}
                    />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;