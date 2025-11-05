
export interface TimeSeriesDataPoint {
  time: string;
  x: number;
  y: number;
  z: number;
}

export interface SensorData {
  accelerometer: TimeSeriesDataPoint[];
  gyroscope: TimeSeriesDataPoint[];
}

export interface TripContext {
  speed: number;
  location: string;
  weather: string;
  traffic: string;
  roadType: string;
  altitude: number;
  accidentHistory: string;
  carCondition: string;
}

export interface LogEntry {
  time: Date;
  message: string;
  type: 'info' | 'warning' | 'alert';
}
