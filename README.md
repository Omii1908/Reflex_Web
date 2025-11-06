# REFLEX - Smart Vehicle Safety Monitor

![REFLEX Banner](https://img.shields.io/badge/REFLEX-Vehicle%20Safety%20Monitor-00d4ff?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.x-61dafb?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript)

**REFLEX** is an intelligent, real-time vehicle accident detection and safety monitoring system that leverages smartphone sensors, environmental data, and AI-powered analysis to enhance road safety.

---

## 🚀 Features

### 🛡️ Real-Time Safety Monitoring
- **Dynamic Risk Assessment** - Continuous calculation of driving risk based on sensor data and environmental factors
- **Live Sensor Visualization** - Real-time accelerometer and gyroscope data charts with smooth curve rendering
- **Intelligent Alerts** - Automatic detection of hard braking, rapid acceleration, and sharp turns

### 🌍 Environmental Integration
- **Geolocation Tracking** - Automatic location detection using browser Geolocation API
- **Weather Integration** - Real-time weather data from Open-Meteo API
- **Elevation Monitoring** - Altitude tracking for terrain-based risk assessment
- **Traffic Analysis** - Time-based traffic density estimation

### 🤖 AI-Powered Analysis
- **Google Gemini AI** - Advanced trip analysis and safety recommendations
- **Contextual Assessment** - Considers road type, weather, traffic, and vehicle condition
- **Predictive Alerts** - Proactive safety warnings based on driving patterns

### 📊 Comprehensive Dashboard
- **Safety Monitor Gauge** - Color-coded circular gauge (green → yellow → red)
- **Live Trip Metrics** - 8-field information grid with speed, location, weather, traffic, road type, elevation, accident history, and car condition
- **Emergency Contacts** - Quick-access emergency contact system with 4 pre-configured contacts
- **System Log** - Real-time activity logging showing latest 3 events
- **Sensor Charts** - Dual-axis charts for accelerometer and gyroscope data

### 🎨 Modern UI/UX
- **Dark Theme** - Professional dark mode with glassmorphism effects
- **Animated Backgrounds** - Dynamic gradient animations
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Smooth Transitions** - Fluid animations and hover effects

---

## 🛠️ Tech Stack

### Frontend Framework
- **React.js** with **TypeScript** - Component-based architecture
- **HTML5 Canvas** - High-performance chart rendering
- **CSS3** - Modern styling with CSS variables and animations
- **SVG Graphics** - Scalable vector icons and gauges

### APIs & Services
| Service | Purpose | Endpoint |
|---------|---------|----------|
| **Google Gemini AI** | Trip analysis and safety recommendations | `@google/genai` |
| **Open-Meteo API** | Weather data and elevation | `https://api.open-meteo.com/v1/forecast` |
| **Nominatim OSM** | Reverse geocoding (location names) | `https://nominatim.openstreetmap.org/reverse` |
| **Geolocation API** | Device location tracking | Browser native API |

### Data Visualization
- **Custom Canvas Charts** - Hand-crafted chart rendering with smooth Bezier curves
- **Real-time Updates** - 1.5-second refresh interval for sensor data
- **Color-Coded Axes** - Red-Yellow-Green (accelerometer), Pink-Red-Purple (gyroscope)

### State Management
- **React Hooks** - `useState`, `useEffect`, `useCallback`, `useRef`
- **Local State** - No external state management libraries

---

## 📦 Installation

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager

### Clone Repository
```bash
git clone https://github.com/yourusername/reflex-safety-monitor.git
cd reflex-safety-monitor
```

### Install Dependencies
```bash
npm install
```

### Environment Setup
Create a `.env` file in the project root:
```env
VITE_GEMINI_API_KEY=your_google_gemini_api_key_here
```

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

---

## 🎯 Usage

### Starting the Application
1. Open the application in a modern web browser
2. Allow location permissions when prompted (optional - defaults to Delhi, India)
3. The system will automatically start monitoring and simulating sensor data

### Understanding the Dashboard

#### Safety Monitor (Top Left)
- **Circular Gauge**: Shows current risk percentage
- **Color Zones**:
  - 🟢 Green (0-40%): Safe driving
  - 🟡 Yellow (41-75%): Elevated risk
  - 🔴 Red (76-100%): Critical risk
- **Stats**: Confidence level, last alert time, trip duration

#### Live Trip Metrics (Top Center)
Real-time contextual information:
- Current speed (km/h)
- Location (city, country)
- Weather conditions
- Traffic density
- Road type
- Elevation (meters)
- Accident history zone
- Vehicle condition

#### Emergency Contacts (Top Right)
Quick-access emergency contacts:
- Priya Singh (Spouse)
- Ravi Kumar (Father)
- Amit Sharma (Friend)
- Dr. Mehta (Family Doctor)

#### Sensor Charts (Middle)
- **Accelerometer**: X (lateral), Y (longitudinal), Z (vertical) forces in m/s²
- **Gyroscope**: X (pitch), Y (roll), Z (yaw) rotation in rad/s

#### System Log (Bottom Right)
Latest 3 system events with timestamps and severity levels

#### AI Analysis (Bottom)
Click "Generate Analysis" to get AI-powered trip assessment

---

## 🧪 Sensor Simulation

### Realistic Driving Patterns
The system simulates authentic car driving behavior:

**Accelerometer (m/s²)**
- X-axis: Lateral forces during turns (±0.3 base, ±20 during events)
- Y-axis: Longitudinal forces (acceleration/braking) (±0.5 base, ±22 during events)
- Z-axis: Vertical forces from road surface (9.8 ± 0.2 base)

**Gyroscope (rad/s)**
- X-axis: Pitch (nose up/down) (±0.05 base, ±3.5 during events)
- Y-axis: Roll (side-to-side tilt) (±0.08 base, ±3.8 during events)
- Z-axis: Yaw (rotation) (±0.03 base, ±2.5 during events)

### High-Risk Events
- **Hard Braking**: 5% probability per tick, -20 to -45 km/h speed reduction
- **Rapid Acceleration**: 4% probability, +15 to +40 km/h speed increase
- **Sharp Turns**: Detected when gyroscope exceeds 1.0 rad/s

---

## 📱 Component Architecture

```
src/
├── components/
│   ├── Header.tsx              # App header with logo and status
│   ├── RiskMeter.tsx            # Circular safety gauge
│   ├── SensorChart.tsx          # Canvas-based sensor charts
│   ├── InfoCard.tsx             # Trip metric cards
│   ├── EmergencyContacts.tsx    # Emergency contact list
│   ├── StatusLog.tsx            # Activity log viewer
│   └── AiAnalysis.tsx           # AI analysis interface
├── services/
│   ├── apiService.ts            # Weather & location APIs
│   └── geminiService.ts         # Google Gemini AI integration
├── types/
│   └── index.ts                 # TypeScript type definitions
├── constants.tsx                # Icons and static data
└── App.tsx                      # Main application component
```

---

## 🔧 Configuration

### Risk Calculation Logic
```javascript
Risk Score = Base Risk + Event Modifiers + Environmental Factors

Event Modifiers:
- Hard Braking: +30%
- Rapid Acceleration: +25%
- Sharp Turn (>1.0 rad/s): +20%

Environmental Factors:
- Heavy Traffic: +2% per tick
- Poor Weather: +5% (not currently implemented)
- High Accident History Zone: +10% (not currently implemented)
```

### Update Intervals
- **Sensor Data**: 1.5 seconds
- **Risk Decay**: -0.7% per tick (during normal driving)
- **Chart Refresh**: Every sensor update
- **Location Update**: On initialization

---

## 🌐 API Integration

### Open-Meteo Weather API
```javascript
const weatherEndpoint = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=weather_code,temperature_2m`;
```

**Response Data Used:**
- Weather code (0-99)
- Temperature (°C)
- Elevation (meters)

### Nominatim Reverse Geocoding
```javascript
const locationEndpoint = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
```

**Response Data Used:**
- City name
- Country name

---

## 🎨 Design System

### Color Palette
```css
/* Dark Theme */
--bg-primary: #0a0a0a
--bg-secondary: #111111
--accent-primary: #00d4ff
--success: #00ff88
--warning: #ffaa00
--danger: #ff3366
```

### Sensor Chart Colors
- **Accelerometer**: Red (#ef4444), Yellow (#fbbf24), Green (#22c55e)
- **Gyroscope**: Pink (#ec4899), Red (#ef4444), Purple (#a855f7)

### Animations
- Floating background gradients (20s loop)
- Pulse effect on status indicators (2s loop)
- Slide-in animations for log entries (0.3s)
- Hover lift effects on cards (0.3s transition)

---

## 📊 Performance Optimization

- **Canvas Rendering**: Device pixel ratio scaling for sharp visuals
- **Data Management**: Sliding window (20 data points) for efficient memory usage
- **Debounced Updates**: 1.5-second intervals prevent UI thrashing
- **Lazy Evaluation**: Charts only redraw on data changes

---

## 🔒 Security & Privacy

- **No Data Storage**: All data processed locally in browser
- **No Backend**: Purely client-side application
- **API Keys**: Environment variables for sensitive credentials
- **HTTPS Only**: Geolocation API requires secure context

---

## 🚧 Future Enhancements

- [ ] Real smartphone sensor integration (DeviceMotion API)
- [ ] Backend ML model for accurate accident prediction
- [ ] SMS/Call integration for emergency contacts
- [ ] Historical trip data storage and analytics
- [ ] Multi-language support
- [ ] Voice alerts and commands
- [ ] Integration with car OBD-II systems
- [ ] Cloud sync for trip history

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style Guidelines
- Use TypeScript for type safety
- Follow React Hooks best practices
- Maintain component modularity
- Add comments for complex logic
- Test on multiple browsers

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Profile](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- **Google Gemini AI** for intelligent trip analysis
- **Open-Meteo** for free weather data API
- **OpenStreetMap** for reverse geocoding services
- **React Team** for the amazing framework

---

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on [GitHub Issues](https://github.com/yourusername/reflex-safety-monitor/issues)
- Check the [FAQ section](#faq)
- Contact via email

---

## 🎯 Project Status

**Current Version**: 1.0.0  
**Status**: Active Development  
**Last Updated**: November 2025

---

## FAQ

**Q: Why does the app ask for location permissions?**  
A: Location is used to fetch real-time weather data and provide accurate regional context for risk assessment. The app works with default settings if denied.

**Q: Can I use this with a real vehicle?**  
A: Currently, this is a demonstration/simulation tool. Future versions will integrate with actual smartphone sensors and vehicle systems.

**Q: How accurate is the risk assessment?**  
A: The current version uses simulated data and heuristic algorithms. Production deployment would require ML models trained on real accident data.

**Q: Does this work offline?**  
A: Partial functionality is available offline (sensor simulation, charts), but weather/location features require internet connectivity.

**Q: Can I customize the emergency contacts?**  
A: Yes! Edit the `EMERGENCY_CONTACTS` array in the source code or implement a settings panel for dynamic configuration.

---

**Built with ❤️ for safer roads**
