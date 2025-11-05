
import { GoogleGenAI } from "@google/genai";
import type { SensorData, TripContext } from '../types';

export async function getTripAnalysis(sensorData: SensorData, tripContext: TripContext, riskScore: number): Promise<string> {
  // FIX: Per coding guidelines, assume API_KEY is present and remove manual check.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const latestAccel = sensorData.accelerometer[sensorData.accelerometer.length - 1];
  const latestGyro = sensorData.gyroscope[sensorData.gyroscope.length - 1];

  const prompt = `
    You are REFLEX, an AI-powered vehicle accident detection system analyst.
    Based on the following real-time data from a trip in India, provide a concise, professional analysis of the current situation.
    The analysis should be a short paragraph (2-3 sentences) and should explain the current risk level based on the data provided, considering road type, altitude, historical accident data for the zone, and the car's condition.
    Do not use markdown.

    Current Data:
    - Risk Score: ${riskScore.toFixed(2)}%
    - Speed: ${tripContext.speed} km/h
    - Location: ${tripContext.location}
    - Altitude: ${tripContext.altitude} meters
    - Weather: ${tripContext.weather}
    - Traffic Conditions: ${tripContext.traffic}
    - Road Type: ${tripContext.roadType}
    - Zone Accident History: ${tripContext.accidentHistory}
    - Car Condition: ${tripContext.carCondition}
    - Latest Accelerometer Reading (x, y, z): ${latestAccel ? `${latestAccel.x.toFixed(2)}, ${latestAccel.y.toFixed(2)}, ${latestAccel.z.toFixed(2)}` : 'N/A'} m/s²
    - Latest Gyroscope Reading (x, y, z): ${latestGyro ? `${latestGyro.x.toFixed(2)}, ${latestGyro.y.toFixed(2)}, ${latestGyro.z.toFixed(2)}` : 'N/A'} rad/s

    Analysis:
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating AI analysis:", error);
    return "Could not generate AI analysis at this time. The model may be unavailable.";
  }
}