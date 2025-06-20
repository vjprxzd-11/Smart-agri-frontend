import React from 'react';
import { ArduinoStatus } from '../types';
import { WifiOff, Wifi, RotateCw } from 'lucide-react';

interface ConnectionStatusProps {
  status: ArduinoStatus;
  onConnect: () => Promise<boolean>;
  isConnecting: boolean;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ 
  status, 
  onConnect,
  isConnecting 
}) => {
  return (
    <div className="relative inline-flex items-center gap-2">
      {status.connected ? (
        <>
          <div className="relative">
            <Wifi size={20} className="text-green-500" />
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Connected
          </span>
        </>
      ) : (
        <>
          <WifiOff size={20} className="text-red-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Disconnected
          </span>
          <button
            onClick={onConnect}
            disabled={isConnecting}
            className={`ml-2 p-1 px-2 text-xs rounded-md flex items-center gap-1 ${
              isConnecting
                ? 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
            }`}
          >
            <RotateCw size={12} className={isConnecting ? 'animate-spin' : ''} />
            {isConnecting ? 'Connecting...' : 'Connect'}
          </button>
        </>
      )}
    </div>
  );
};

export default ConnectionStatus;