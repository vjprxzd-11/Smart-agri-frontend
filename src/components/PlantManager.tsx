import React, { useState } from 'react';
import { usePlant } from '../context/PlantContext';
import { Plant } from '../types';
import { Edit3, Save, X, Upload } from 'lucide-react';

interface PlantManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const PlantManager: React.FC<PlantManagerProps> = ({ isOpen, onClose }) => {
  const { plantOptions, updatePlant } = usePlant();
  const [editingPlant, setEditingPlant] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Plant>>({});

  if (!isOpen) return null;

  const handleEditStart = (plant: Plant) => {
    setEditingPlant(plant.id);
    setEditForm(plant);
  };

  const handleEditSave = () => {
    if (editingPlant && editForm) {
      updatePlant(editingPlant, editForm as Plant);
      setEditingPlant(null);
      setEditForm({});
    }
  };

  const handleEditCancel = () => {
    setEditingPlant(null);
    setEditForm({});
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Plant Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Note:</strong> You have two fixed levels in your smart agriculture system. 
              You can edit the plant names, images, water usage, and optimal growing conditions for each level.
            </p>
          </div>

          {/* Plants List */}
          <div className="space-y-6">
            {plantOptions.map((plant) => (
              <div key={plant.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                {editingPlant === plant.id ? (
                  <div className="space-y-6">
                    {/* Basic Plant Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Plant Name
                        </label>
                        <input
                          type="text"
                          value={editForm.name || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                          placeholder="Enter plant name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Water Usage (L/day)
                        </label>
                        <input
                          type="number"
                          value={editForm.waterUsagePerDay || 0}
                          onChange={(e) => setEditForm(prev => ({ ...prev, waterUsagePerDay: Number(e.target.value) }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                          placeholder="0.0"
                          step="0.1"
                          min="0"
                        />
                      </div>
                    </div>

                    {/* Plant Image */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Plant Image URL
                      </label>
                      <div className="flex gap-4">
                        <input
                          type="url"
                          value={editForm.image || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, image: e.target.value }))}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                          placeholder="https://example.com/plant-image.jpg"
                        />
                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                          <img
                            src={editForm.image || plant.image}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg';
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Optimal Conditions */}
                    <div>
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Optimal Growing Conditions</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(editForm.optimalConditions || {}).map(([key, condition]) => (
                          <div key={key} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </label>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 dark:text-gray-400 w-8">Min:</span>
                                <input
                                  type="number"
                                  value={condition.min}
                                  onChange={(e) => setEditForm(prev => ({
                                    ...prev,
                                    optimalConditions: {
                                      ...prev.optimalConditions!,
                                      [key]: { ...condition, min: Number(e.target.value) }
                                    }
                                  }))}
                                  className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-600 dark:text-white"
                                />
                                <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[40px]">
                                  {condition.unit}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 dark:text-gray-400 w-8">Max:</span>
                                <input
                                  type="number"
                                  value={condition.max}
                                  onChange={(e) => setEditForm(prev => ({
                                    ...prev,
                                    optimalConditions: {
                                      ...prev.optimalConditions!,
                                      [key]: { ...condition, max: Number(e.target.value) }
                                    }
                                  }))}
                                  className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-600 dark:text-white"
                                />
                                <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[40px]">
                                  {condition.unit}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={handleEditSave}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Save size={16} />
                        Save Changes
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        <X size={16} />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                        <img
                          src={plant.image}
                          alt={plant.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{plant.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Water usage: {plant.waterUsagePerDay || 0} L/day
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Device: {plant.id === 'level1' ? 'esp32_1' : 'esp32_2'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleEditStart(plant)}
                      className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                    >
                      <Edit3 size={16} />
                      Edit Details
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantManager;