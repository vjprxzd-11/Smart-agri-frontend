import React from 'react';
import { Alert } from '../types';
import { AlertCircle, Bell, Check, X } from 'lucide-react';

interface AlertsProps {
  alerts: Alert[];
  onMarkAsRead: (id: string) => void;
}

const Alerts: React.FC<AlertsProps> = ({ alerts, onMarkAsRead }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const unreadCount = alerts.filter(a => !a.read).length;

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'success':
        return <Check className="h-4 w-4 text-green-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  const getAlertClass = (type: Alert['type']) => {
    switch (type) {
      case 'warning':
        return 'bg-amber-50 border-amber-200 dark:bg-amber-900/30 dark:border-amber-800';
      case 'error':
        return 'bg-red-50 border-red-200 dark:bg-red-900/30 dark:border-red-800';
      case 'success':
        return 'bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-800';
      default:
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800';
    }
  };

  return (
    <div className="relative inline-block">
      <button
        className="relative p-2 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          ></div>
          
          <div className="absolute right-0 z-20 w-80 mt-2 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden">
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Notifications</h3>
              <button
                className="text-gray-400 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300"
                onClick={() => setIsOpen(false)}
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="max-h-60 overflow-y-auto">
              {alerts.length === 0 ? (
                <div className="py-4 px-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                  No notifications
                </div>
              ) : (
                alerts.map((alert) => (
                  <div 
                    key={alert.id}
                    className={`relative p-3 border-b border-gray-200 dark:border-gray-700 ${
                      alert.read ? 'opacity-70' : ''
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 pt-0.5">
                        {getAlertIcon(alert.type)}
                      </div>
                      <div className="ml-3 w-0 flex-1">
                        <p className="text-sm text-gray-900 dark:text-white">
                          {alert.message}
                        </p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      {!alert.read && (
                        <div className="ml-4 flex-shrink-0 flex">
                          <button
                            className="bg-white dark:bg-gray-700 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
                            onClick={(e) => {
                              e.stopPropagation();
                              onMarkAsRead(alert.id);
                            }}
                          >
                            <span className="sr-only">Mark as read</span>
                            <Check size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {!alert.read && (
                      <span className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Alerts;