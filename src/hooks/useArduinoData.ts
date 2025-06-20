import { useState, useEffect } from 'react';
import arduinoService from '../services/ArduinoService';
import { SensorData, PlantType, Alert, PlantHealth, ReservoirLevels, ArduinoStatus } from '../types';

export const useArduinoData = (plantType: PlantType) => {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [reservoirLevels, setReservoirLevels] = useState<ReservoirLevels>({ 
    water: 0, 
    waterCm: 0,
    fertilizer: 0, 
    fertilizerCm: 0 
  });
  const [connectionStatus, setConnectionStatus] = useState<ArduinoStatus>({
    connected: false,
    lastConnected: null,
  });
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleData = (data: SensorData) => {
      // Validate that the data is for the current plant type
      const expectedDeviceId = plantType === 'level1' ? 'esp32_1' : 'esp32_2';
      if (!data.deviceId || data.deviceId === expectedDeviceId) {
        setSensorData(data);
        setIsLoading(false);
      }
    };

    const handleReservoirData = (levels: ReservoirLevels) => {
      setReservoirLevels(levels);
    };

    const handleConnection = (status: { connected: boolean }) => {
      setConnectionStatus({
        connected: status.connected,
        lastConnected: status.connected ? new Date().toISOString() : connectionStatus.lastConnected,
      });
      
      if (status.connected) {
        setIsLoading(false);
      }
    };

    const handleAlert = (alert: Alert) => {
      setAlerts(prev => [alert, ...prev].slice(0, 10));
    };

    const handleError = (error: { message: string; details?: string }) => {
      console.error('Arduino service error:', error);
      
      const errorAlert: Alert = {
        id: Date.now().toString(),
        type: 'error',
        message: error.message,
        timestamp: new Date().toISOString(),
        read: false,
      };
      
      setAlerts(prev => [errorAlert, ...prev].slice(0, 10));
    };

    const handleControlSuccess = (response: any) => {
      const successAlert: Alert = {
        id: Date.now().toString(),
        type: 'success',
        message: response.message || `${response.action} command executed successfully`,
        timestamp: new Date().toISOString(),
        read: false,
      };
      
      setAlerts(prev => [successAlert, ...prev].slice(0, 10));
    };

    const handleControlError = (response: any) => {
      const errorAlert: Alert = {
        id: Date.now().toString(),
        type: 'error',
        message: response.message || `Failed to execute ${response.action} command`,
        timestamp: new Date().toISOString(),
        read: false,
      };
      
      setAlerts(prev => [errorAlert, ...prev].slice(0, 10));
    };

    // Subscribe to events
    arduinoService.on('data', handleData);
    arduinoService.on('reservoir', handleReservoirData);
    arduinoService.on('connection', handleConnection);
    arduinoService.on('alert', handleAlert);
    arduinoService.on('error', handleError);
    arduinoService.on('controlSuccess', handleControlSuccess);
    arduinoService.on('controlError', handleControlError);

    // Set active plant
    arduinoService.setActivePlant(plantType);

    // Try to connect if not already connected
    if (!arduinoService.isConnected()) {
      arduinoService.connect().then((connected) => {
        if (!connected) {
          setIsLoading(false);
        }
      });
    } else {
      setConnectionStatus({
        connected: true,
        lastConnected: new Date().toISOString(),
      });
      setIsLoading(false);
    }

    // Initial reservoir levels
    setReservoirLevels(arduinoService.getReservoirLevels());
    
    return () => {
      // Unsubscribe from events
      arduinoService.off('data', handleData);
      arduinoService.off('reservoir', handleReservoirData);
      arduinoService.off('connection', handleConnection);
      arduinoService.off('alert', handleAlert);
      arduinoService.off('error', handleError);
      arduinoService.off('controlSuccess', handleControlSuccess);
      arduinoService.off('controlError', handleControlError);
    };
  }, [plantType, connectionStatus.lastConnected]);

  // Calculate plant health based on sensor data with improved algorithm
  const calculatePlantHealth = (): PlantHealth => {
    if (!sensorData) {
      return { status: 'fair', score: 50 };
    }

    // Health calculation based on multiple factors
    let totalScore = 0;
    let factorCount = 0;

    // Soil moisture (most important for plant health)
    if (sensorData.moisture >= 60 && sensorData.moisture <= 80) {
      totalScore += 100;
    } else {
      totalScore += Math.max(0, 100 - Math.abs(sensorData.moisture - 70) * 2);
    }
    factorCount++;

    // Temperature
    if (sensorData.temperature >= 15 && sensorData.temperature <= 25) {
      totalScore += 100;
    } else {
      totalScore += Math.max(0, 100 - Math.abs(sensorData.temperature - 20) * 3);
    }
    factorCount++;

    // Humidity
    if (sensorData.humidity >= 50 && sensorData.humidity <= 70) {
      totalScore += 100;
    } else {
      totalScore += Math.max(0, 100 - Math.abs(sensorData.humidity - 60) * 2);
    }
    factorCount++;

    // Nutrient levels (NPK average)
    const avgNutrients = (sensorData.nitrogen + sensorData.phosphorus + sensorData.potassium) / 3;
    if (avgNutrients >= 40 && avgNutrients <= 80) {
      totalScore += 100;
    } else {
      totalScore += Math.max(0, 100 - Math.abs(avgNutrients - 60) * 1.5);
    }
    factorCount++;

    const overallScore = totalScore / factorCount;
    
    let status: PlantHealth['status'];
    if (overallScore >= 90) status = 'excellent';
    else if (overallScore >= 75) status = 'good';
    else if (overallScore >= 50) status = 'fair';
    else if (overallScore >= 25) status = 'poor';
    else status = 'critical';

    return { status, score: overallScore };
  };

  // Function to send control actions
  const sendControlAction = async (action: 'water' | 'light' | 'nutrients') => {
    return await arduinoService.sendCommand(action);
  };

  // Function to connect/reconnect to Arduino
  const connectToArduino = async () => {
    return await arduinoService.connect();
  };

  // Mark an alert as read
  const markAlertAsRead = (id: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === id ? { ...alert, read: true } : alert
      )
    );
  };

  return {
    sensorData,
    reservoirLevels,
    connectionStatus,
    alerts,
    isLoading,
    plantHealth: calculatePlantHealth(),
    sendControlAction,
    connectToArduino,
    markAlertAsRead,
  };
};