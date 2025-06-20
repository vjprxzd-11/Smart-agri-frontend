import React from 'react';
import { ReservoirLevels } from '../types';
import { Droplet, FlaskRound as Flask } from 'lucide-react';

interface ReservoirStatusProps {
  levels: ReservoirLevels;
}

const ReservoirStatus: React.FC<ReservoirStatusProps> = ({ levels }) => {
  const getWaterLevelColor = (level: number) => {
    if (level < 20) return 'text-red-500';
    if (level < 40) return 'text-orange-500';
    return 'text-blue-500';
  };

  const getFertilizerLevelColor = (level: number) => {
    if (level < 20) return 'text-red-500';
    if (level < 40) return 'text-orange-500';
    return 'text-green-500';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Reservoir Status</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Water Reservoir */}
        <div className="flex flex-col items-center">
          <div className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
            Water Level (esp32_1)
          </div>
          <div className="relative flex items-center justify-center h-36 w-36">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle 
                cx="60" 
                cy="60" 
                r="54"
                fill="none" 
                stroke="#e5e7eb" 
                strokeWidth="12" 
                className="dark:stroke-gray-700" 
              />
              <circle 
                cx="60" 
                cy="60" 
                r="54"
                fill="none" 
                stroke="currentColor" 
                strokeWidth="12" 
                strokeDasharray={`${Math.round(levels.water) * 3.39} 339`}
                strokeDashoffset="0" 
                strokeLinecap="round" 
                className={getWaterLevelColor(levels.water)}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <Droplet size={24} className={getWaterLevelColor(levels.water)} />
              <div className={`text-2xl font-bold mt-1 ${getWaterLevelColor(levels.water)}`}>
                {Math.round(levels.water)}%
              </div>
            </div>
          </div>
          
          <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full ${levels.water < 20 ? 'bg-red-500' : levels.water < 40 ? 'bg-orange-500' : 'bg-blue-500'}`}
              style={{ width: `${Math.round(levels.water)}%` }}
            ></div>
          </div>
          
          <div className="mt-2 text-center">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {Math.round(levels.waterCm || 0)} cm
            </div>
            {levels.water < 20 && (
              <div className="text-sm text-red-500 font-medium">Low water level! Please refill soon.</div>
            )}
          </div>
        </div>
        
        {/* Fertilizer Reservoir */}
        <div className="flex flex-col items-center">
          <div className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
            Fertilizer Level (esp32_2)
          </div>
          <div className="relative flex items-center justify-center h-36 w-36">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle 
                cx="60" 
                cy="60" 
                r="54"
                fill="none" 
                stroke="#e5e7eb" 
                strokeWidth="12" 
                className="dark:stroke-gray-700" 
              />
              <circle 
                cx="60" 
                cy="60" 
                r="54"
                fill="none" 
                stroke="currentColor" 
                strokeWidth="12" 
                strokeDasharray={`${Math.round(levels.fertilizer) * 3.39} 339`}
                strokeDashoffset="0" 
                strokeLinecap="round" 
                className={getFertilizerLevelColor(levels.fertilizer)}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <Flask size={24} className={getFertilizerLevelColor(levels.fertilizer)} />
              <div className={`text-2xl font-bold mt-1 ${getFertilizerLevelColor(levels.fertilizer)}`}>
                {Math.round(levels.fertilizer)}%
              </div>
            </div>
          </div>
          
          <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full ${levels.fertilizer < 20 ? 'bg-red-500' : levels.fertilizer < 40 ? 'bg-orange-500' : 'bg-green-500'}`}
              style={{ width: `${Math.round(levels.fertilizer)}%` }}
            ></div>
          </div>
          
          <div className="mt-2 text-center">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {Math.round(levels.fertilizerCm || 0)} cm
            </div>
            {levels.fertilizer < 20 && (
              <div className="text-sm text-red-500 font-medium">Low fertilizer level! Please refill soon.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservoirStatus;