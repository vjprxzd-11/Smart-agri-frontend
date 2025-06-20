import React from 'react';
import { usePlant } from '../context/PlantContext';
import { Leaf, Menu, X, Settings } from 'lucide-react';
import { PlantType } from '../types';

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (isOpen: boolean) => void;
  onManagePlants: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, setIsMobileOpen, onManagePlants }) => {
  const { activePlant, setActivePlantType, plantOptions } = usePlant();

  const handlePlantSelect = (plantType: PlantType) => {
    setActivePlantType(plantType);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden absolute left-4 top-4 z-20">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-md bg-white dark:bg-gray-800 shadow-md text-gray-700 dark:text-gray-300"
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar - desktop is always visible, mobile is conditional */}
      <aside 
        className={`${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg z-10 transform transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Leaf className="h-7 w-7 text-green-600 dark:text-green-500" />
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                Smart Agriculture
              </h1>
            </div>
          </div>

          {/* Plants Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="flex justify-between items-center px-6 mb-3">
              <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Growing Levels
              </h2>
              <button
                onClick={onManagePlants}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
                title="Edit Plant Details"
              >
                <Settings size={16} />
              </button>
            </div>
            <div className="space-y-1">
              {plantOptions.map((plant) => (
                <button
                  key={plant.id}
                  onClick={() => handlePlantSelect(plant.id as PlantType)}
                  className={`w-full flex items-center px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                    activePlant.id === plant.id
                      ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-l-4 border-green-600 dark:border-green-500'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex-shrink-0 w-8 h-8 mr-3 rounded-full overflow-hidden">
                    <img 
                      src={plant.image} 
                      alt={plant.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <div>{plant.name}</div>
                    {plant.waterUsagePerDay && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {plant.waterUsagePerDay}L/day
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-xs text-center text-gray-500 dark:text-gray-400">
            Smart Agriculture Box &copy; 2025
          </div>
        </div>
      </aside>
      
      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-[5]"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;