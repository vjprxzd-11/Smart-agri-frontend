import React, { useState } from 'react';
import { Plant } from '../types';
import { usePlant } from '../context/PlantContext';
import { Edit3, Save, X } from 'lucide-react';

interface EditableOptimalConditionsProps {
  plant: Plant;
}

const EditableOptimalConditions: React.FC<EditableOptimalConditionsProps> = ({ plant }) => {
  const { updatePlant } = usePlant();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(plant);

  const handleSave = () => {
    updatePlant(plant.id, editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(plant);
    setIsEditing(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col md:flex-row gap-6">
      {/* Plant Image */}
      <div className="w-full md:w-1/3 flex-shrink-0">
        <div className="relative rounded-lg overflow-hidden h-48 md:h-full">
          <img
            src={plant.image}
            alt={plant.name}
            className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-105"
          />
        </div>
      </div>

      {/* Plant Details and Conditions */}
      <div className="flex-grow">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {plant.name}
            </h2>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Water usage: {plant.waterUsagePerDay || 0} L/day
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Device: {plant.id === 'level1' ? 'esp32_1' : 'esp32_2'}
              </span>
            </div>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
              title="Edit conditions"
            >
              <Edit3 size={16} />
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900 rounded-lg transition-colors"
                title="Save changes"
              >
                <Save size={16} />
              </button>
              <button
                onClick={handleCancel}
                className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                title="Cancel editing"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
            Optimal Growing Conditions
          </h3>

          {isEditing ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(editForm.optimalConditions).map(([key, condition]) => (
                <div key={key} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-gray-500 dark:text-gray-400 w-8">Min:</label>
                      <input
                        type="number"
                        value={condition.min}
                        onChange={(e) => setEditForm(prev => ({
                          ...prev,
                          optimalConditions: {
                            ...prev.optimalConditions,
                            [key]: { ...condition, min: Number(e.target.value) }
                          }
                        }))}
                        className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-600 dark:text-white"
                      />
                      <span className="text-xs text-gray-500 dark:text-gray-400 w-8">{condition.unit}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-gray-500 dark:text-gray-400 w-8">Max:</label>
                      <input
                        type="number"
                        value={condition.max}
                        onChange={(e) => setEditForm(prev => ({
                          ...prev,
                          optimalConditions: {
                            ...prev.optimalConditions,
                            [key]: { ...condition, max: Number(e.target.value) }
                          }
                        }))}
                        className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-600 dark:text-white"
                      />
                      <span className="text-xs text-gray-500 dark:text-gray-400 w-8">{condition.unit}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(plant.optimalConditions).map(([key, condition]) => (
                <div key={key} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </h4>
                  <p className="text-gray-900 dark:text-white font-semibold mt-1">
                    {condition.min} - {condition.max} {condition.unit}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditableOptimalConditions;