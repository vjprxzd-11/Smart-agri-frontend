import React from 'react';
import { SensorData, Plant } from '../types';
import { Droplet, Sun, Thermometer, Droplets, FlaskRound as Flask, Heart, Zap } from 'lucide-react';

interface SensorReadingsProps {
  data: SensorData | null;
  plant: Plant;
  plantHealth: {
    status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
    score: number;
  };
  isLoading: boolean;
}

const SensorReadings: React.FC<SensorReadingsProps> = ({ data, plant, plantHealth, isLoading }) => {
  if (isLoading || !data) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(7)].map((_, index) => (
            <div key={index} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const getStatusColor = (value: number, optimal: { min: number; max: number }) => {
    if (value < optimal.min) return 'text-red-500';
    if (value > optimal.max) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getStatusText = (value: number, optimal: { min: number; max: number }) => {
    if (value < optimal.min) return 'Low';
    if (value > optimal.max) return 'High';
    return 'Optimal';
  };

  const getProgressPercentage = (value: number, optimal: { min: number; max: number }) => {
    // Calculate percentage based on optimal range
    const range = optimal.max - optimal.min;
    const adjustedValue = Math.max(0, Math.min(value, optimal.max));
    return Math.min((adjustedValue / optimal.max) * 100, 100);
  };

  const getProgressColor = (value: number, optimal: { min: number; max: number }) => {
    if (value < optimal.min) return 'bg-red-500';
    if (value > optimal.max) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getHealthIcon = () => {
    switch (plantHealth.status) {
      case 'excellent':
        return <Heart className="h-8 w-8 text-green-500" />;
      case 'good':
        return <Heart className="h-8 w-8 text-blue-500" />;
      case 'fair':
        return <Heart className="h-8 w-8 text-yellow-500" />;
      case 'poor':
        return <Heart className="h-8 w-8 text-orange-500" />;
      case 'critical':
        return <Heart className="h-8 w-8 text-red-500" />;
    }
  };

  const healthColors: Record<string, string> = {
    excellent: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    good: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    fair: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    poor: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Sensor Readings - {plant.name}
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Device: {plant.id === 'level1' ? 'esp32_1' : 'esp32_2'}
          </span>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${healthColors[plantHealth.status]}`}>
            Plant Health: {plantHealth.status.charAt(0).toUpperCase() + plantHealth.status.slice(1)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Soil Moisture */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Droplet className="h-5 w-5 text-blue-500 mr-2" />
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Soil Moisture</h3>
            </div>
            <span className={`text-xs font-medium ${getStatusColor(data.moisture, plant.optimalConditions.moisture)}`}>
              {getStatusText(data.moisture, plant.optimalConditions.moisture)}
            </span>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.round(data.moisture * 100) / 100}%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Target: {plant.optimalConditions.moisture.min}-{plant.optimalConditions.moisture.max}%
            </div>
          </div>
          <div className="mt-2 h-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${getProgressColor(data.moisture, plant.optimalConditions.moisture)}`}
              style={{ width: `${getProgressPercentage(data.moisture, plant.optimalConditions.moisture)}%` }}
            ></div>
          </div>
        </div>

        {/* Sunlight */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Sun className="h-5 w-5 text-amber-500 mr-2" />
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Sunlight</h3>
            </div>
            <span className={`text-xs font-medium ${getStatusColor(data.sunlight, plant.optimalConditions.sunlight)}`}>
              {getStatusText(data.sunlight, plant.optimalConditions.sunlight)}
            </span>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.round(data.sunlight * 100) / 100} lux
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Target: {plant.optimalConditions.sunlight.min}-{plant.optimalConditions.sunlight.max}
            </div>
          </div>
          <div className="mt-2 h-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${getProgressColor(data.sunlight, plant.optimalConditions.sunlight)}`}
              style={{ width: `${getProgressPercentage(data.sunlight, plant.optimalConditions.sunlight)}%` }}
            ></div>
          </div>
        </div>

        {/* Nitrogen */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Zap className="h-5 w-5 text-purple-500 mr-2" />
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Nitrogen</h3>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.round(data.nitrogen * 100) / 100} mg/kg
            </div>
          </div>
          <div className="mt-2 h-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
            <div 
              className="h-full bg-purple-500 rounded-full" 
              style={{ width: `${Math.min((Math.round(data.nitrogen) / 100) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Phosphorus */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Flask className="h-5 w-5 text-orange-500 mr-2" />
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Phosphorus</h3>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.round(data.phosphorus * 100) / 100} mg/kg
            </div>
          </div>
          <div className="mt-2 h-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
            <div 
              className="h-full bg-orange-500 rounded-full" 
              style={{ width: `${Math.min((Math.round(data.phosphorus) / 100) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Potassium */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Droplets className="h-5 w-5 text-pink-500 mr-2" />
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Potassium</h3>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.round(data.potassium * 100) / 100} mg/kg
            </div>
          </div>
          <div className="mt-2 h-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
            <div 
              className="h-full bg-pink-500 rounded-full" 
              style={{ width: `${Math.min((Math.round(data.potassium) / 100) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Humidity */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Droplet className="h-5 w-5 text-indigo-500 mr-2" />
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Humidity</h3>
            </div>
            <span className={`text-xs font-medium ${getStatusColor(data.humidity, plant.optimalConditions.humidity)}`}>
              {getStatusText(data.humidity, plant.optimalConditions.humidity)}
            </span>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.round(data.humidity * 100) / 100}%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Target: {plant.optimalConditions.humidity.min}-{plant.optimalConditions.humidity.max}%
            </div>
          </div>
          <div className="mt-2 h-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${getProgressColor(data.humidity, plant.optimalConditions.humidity)}`}
              style={{ width: `${getProgressPercentage(data.humidity, plant.optimalConditions.humidity)}%` }}
            ></div>
          </div>
        </div>

        {/* Temperature */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Thermometer className="h-5 w-5 text-red-500 mr-2" />
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Temperature</h3>
            </div>
            <span className={`text-xs font-medium ${getStatusColor(data.temperature, plant.optimalConditions.temperature)}`}>
              {getStatusText(data.temperature, plant.optimalConditions.temperature)}
            </span>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.round(data.temperature * 100) / 100}°C
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Target: {plant.optimalConditions.temperature.min}-{plant.optimalConditions.temperature.max}°C
            </div>
          </div>
          <div className="mt-2 h-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${getProgressColor(data.temperature, plant.optimalConditions.temperature)}`}
              style={{ width: `${getProgressPercentage(data.temperature, plant.optimalConditions.temperature)}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
        <div>
          Last updated: {data ? new Date(data.timestamp).toLocaleTimeString() : '-'}
        </div>
        <div className="flex items-center">
          {getHealthIcon()}
          <span className="ml-2">Health Score: {Math.round(plantHealth.score)}%</span>
        </div>
      </div>
    </div>
  );
};

export default SensorReadings;