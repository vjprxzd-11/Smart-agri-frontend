import React, { createContext, useContext, useState } from 'react';
import { Plant, PlantType } from '../types';

// Fixed plant data for Level 1 and Level 2 - cannot be modified
const fixedPlantData: Record<PlantType, Plant> = {
  level1: {
    id: 'level1',
    name: 'Level 1',
    image: 'https://images.pexels.com/photos/7657084/pexels-photo-7657084.jpeg?auto=compress&cs=tinysrgb&w=600',
    waterUsagePerDay: 1.2,
    optimalConditions: {
      moisture: { min: 65, max: 85, unit: '%' },
      sunlight: { min: 4500, max: 7500, unit: 'lux' },
      temperature: { min: 15, max: 22, unit: '°C' },
      humidity: { min: 60, max: 80, unit: '%' },
      nitrogenLevel: { min: 550, max: 750, unit: 'mg/kg' },
      phosphorusLevel: { min: 550, max: 750, unit: 'mg/kg' },
      potassiumLevel: { min: 550, max: 750, unit: 'mg/kg' },
    },
  },
  level2: {
    id: 'level2',
    name: 'Level 2',
    image: 'https://images.pexels.com/photos/7657084/pexels-photo-7657084.jpeg?auto=compress&cs=tinysrgb&w=600',
    waterUsagePerDay: 1.8,
    optimalConditions: {
      moisture: { min: 65, max: 85, unit: '%' },
      sunlight: { min: 4500, max: 7500, unit: 'lux' },
      temperature: { min: 15, max: 22, unit: '°C' },
      humidity: { min: 60, max: 80, unit: '%' },
      nitrogenLevel: { min: 550, max: 750, unit: 'mg/kg' },
      phosphorusLevel: { min: 550, max: 750, unit: 'mg/kg' },
      potassiumLevel: { min: 550, max: 750, unit: 'mg/kg' },
    },
  },
};

interface PlantContextType {
  activePlant: Plant;
  setActivePlantType: (type: PlantType) => void;
  plantOptions: Plant[];
  updatePlant: (id: string, updatedPlant: Partial<Plant>) => void;
}

const PlantContext = createContext<PlantContextType | undefined>(undefined);

export const PlantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [plants, setPlants] = useState<Record<string, Plant>>(fixedPlantData);
  const [activePlantType, setActivePlantType] = useState<PlantType>('level1');
  
  const plantOptions = Object.values(plants);
  const activePlant = plants[activePlantType] || plantOptions[0];

  const updatePlant = (id: string, updatedPlant: Partial<Plant>) => {
    setPlants(prev => ({
      ...prev,
      [id]: { ...prev[id], ...updatedPlant }
    }));
  };

  const handleSetActivePlantType = (type: PlantType) => {
    if (plants[type]) {
      setActivePlantType(type);
    }
  };
  
  return (
    <PlantContext.Provider
      value={{
        activePlant,
        setActivePlantType: handleSetActivePlantType,
        plantOptions,
        updatePlant,
      }}
    >
      {children}
    </PlantContext.Provider>
  );
};

export const usePlant = () => {
  const context = useContext(PlantContext);
  if (context === undefined) {
    throw new Error('usePlant must be used within a PlantProvider');
  }
  return context;
};