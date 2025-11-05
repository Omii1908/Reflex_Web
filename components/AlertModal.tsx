
import React, { useState, useEffect, useRef } from 'react';
import { ALERT_COUNTDOWN_SECONDS } from '../constants';
import { Location } from '../types';

interface AlertModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  riskScore: number;
  location: Location | null | undefined;
}

const AlertModal: React.FC<AlertModalProps> = ({ isOpen, onCancel, onConfirm, riskScore, location }) => {
  const [countdown, setCountdown] = useState(ALERT_COUNTDOWN_SECONDS);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCountdown(ALERT_COUNTDOWN_SECONDS);
      timerRef.current = window.setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (countdown <= 0) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      onConfirm();
    }
  }, [countdown, onConfirm]);

  if (!isOpen) {
    return null;
  }

  const circumference = 2 * Math.PI * 50;
  const strokeDashoffset = circumference - (countdown / ALERT_COUNTDOWN_SECONDS) * circumference;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-brand-secondary border-2 border-brand-danger p-8 rounded-2xl shadow-2xl text-center max-w-md w-full mx-4">
        <div className="flex justify-center mb-4">
          <svg className="h-16 w-16 text-brand-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-brand-danger mb-2 font-orbitron">HIGH-RISK EVENT DETECTED</h2>
        <p className="text-gray-300 mb-6">A potential accident has been detected based on sensor data.</p>
        
        <div className="relative w-32 h-32 mx-auto mb-6">
          <svg className="w-full h-full" viewBox="0 0 120 120">
            <circle className="text-gray-700" strokeWidth="8" stroke="currentColor" fill="transparent" r="50" cx="60" cy="60" />
            <circle
              className="text-brand-danger transition-all duration-1000 linear"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="50"
              cx="60"
              cy="60"
              transform="rotate(-90 60 60)"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-4xl font-bold font-orbitron text-white">
            {countdown}
          </span>
        </div>
        
        <p className="text-gray-400 text-sm mb-6">
          Emergency contacts will be notified automatically unless you cancel.
          <br/>
          Risk Score: {riskScore}% | Location: {location ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : 'N/A'}
        </p>

        <button
          onClick={onCancel}
          className="w-full py-4 px-6 rounded-lg font-semibold text-lg text-white bg-brand-safe/80 hover:bg-brand-safe transition-colors"
        >
          Cancel Alert - I'm OK
        </button>
      </div>
    </div>
  );
};

export default AlertModal;
