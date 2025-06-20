// Authentication types
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Plant types - Fixed to only Level 1 and Level 2
export type PlantType = 'level1' | 'level2';

export interface Plant {
  id: PlantType;
  name: string;
  image: string;
  waterUsagePerDay?: number; // Liters per day
  optimalConditions: {
    moisture: { min: number; max: number; unit: string };
    waterLevel: { min: number; max: number; unit: string };
    sunlight: { min: number; max: number; unit: string };
    temperature: { min: number; max: number; unit: string };
    humidity: { min: number; max: number; unit: string };
    nutrientLevel: { min: number; max: number; unit: string };
  };
}

// Sensor data types with device-specific data distribution
export interface SensorData {
  // Temperature and humidity from ESP32_1 for both levels
  temperature: number;
  humidity: number;
  
  // Water level from ESP32_1 (displayed in reservoir for both levels)
  waterLevel: number;
  
  // Fertilizer level from ESP32_2 (displayed in reservoir for both levels)
  fertilizerLevel: number;
  
  // Level-specific data:
  // Level 1: moisture, sunlight, NPK from ESP32_1
  // Level 2: moisture, sunlight, NPK from ESP32_2
  moisture: number; // Soil moisture percentage
  sunlight: number; // Lux value
  nitrogen: number; // N value (mg/kg)
  phosphorus: number; // P value (mg/kg)
  potassium: number; // K value (mg/kg)
  
  timestamp: string;
  deviceId?: string; // 'esp32_1' or 'esp32_2'
}

export interface PlantHealth {
  status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  score: number;
}

export interface ReservoirLevels {
  water: number; // Percentage from ESP32_1
  waterCm: number; // Centimeters
  fertilizer: number; // Percentage from ESP32_2
  fertilizerCm: number; // Centimeters
}

export interface ArduinoStatus {
  connected: boolean;
  lastConnected: string | null;
}

// Historical data point
export interface DataPoint {
  timestamp: string;
  value: number;
}

// Control actions
export type ControlAction = 'water' | 'light' | 'nutrients';

// Alert types
export type AlertType = 'info' | 'warning' | 'error' | 'success';

export interface Alert {
  id: string;
  type: AlertType;
  message: string;
  timestamp: string;
  read: boolean;
}