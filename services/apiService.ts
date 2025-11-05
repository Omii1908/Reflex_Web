// WMO Weather interpretation codes (https://open-meteo.com/en/docs)
const WEATHER_CODES: { [key: number]: string } = {
    0: 'Clear',
    1: 'Mainly Clear',
    2: 'Partly Cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing Rime Fog',
    51: 'Light Drizzle',
    53: 'Moderate Drizzle',
    55: 'Dense Drizzle',
    56: 'Light Freezing Drizzle',
    57: 'Dense Freezing Drizzle',
    61: 'Slight Rain',
    63: 'Moderate Rain',
    65: 'Heavy Rain',
    66: 'Light Freezing Rain',
    67: 'Heavy Freezing Rain',
    71: 'Slight Snow',
    73: 'Moderate Snow',
    75: 'Heavy Snow',
    77: 'Snow Grains',
    80: 'Slight Rain Showers',
    81: 'Moderate Rain Showers',
    82: 'Violent Rain Showers',
    85: 'Slight Snow Showers',
    86: 'Heavy Snow Showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm & Hail',
    99: 'Thunderstorm & Heavy Hail',
};

function mapWeatherCode(code: number): string {
    return WEATHER_CODES[code] || 'Unknown';
}

export interface RealtimeData {
    weather: string;
    altitude: number;
    location: string;
}

export async function fetchRealtimeData(lat: number, lon: number): Promise<RealtimeData> {
    try {
        // Fetch weather and location data in parallel for efficiency
        const [weatherResponse, locationResponse] = await Promise.all([
            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=weather_code,temperature_2m`),
            fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`)
        ]);

        if (!weatherResponse.ok) {
            throw new Error('Failed to fetch weather data.');
        }
        if (!locationResponse.ok) {
            throw new Error('Failed to fetch location data.');
        }

        const weatherData = await weatherResponse.json();
        const locationData = await locationResponse.json();
        
        const weatherDescription = mapWeatherCode(weatherData.current.weather_code);
        const temperature = weatherData.current.temperature_2m;
        const weather = `${weatherDescription}, ${temperature}°C`;

        const altitude = weatherData.elevation || 0;
        
        const city = locationData.address.city || locationData.address.town || locationData.address.village || 'Unknown Area';
        const country = locationData.address.country || '';
        const location = country ? `${city}, ${country}`: city;

        return { weather, altitude, location };

    } catch (error) {
        console.error("Error fetching real-time data:", error);
        throw new Error("Could not fetch environmental data. Using defaults.");
    }
}