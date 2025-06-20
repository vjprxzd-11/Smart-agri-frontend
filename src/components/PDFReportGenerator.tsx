import React from 'react';
import { SensorData, Plant } from '../types';
import { Download, FileText, Clock, Calendar } from 'lucide-react';

interface PDFReportGeneratorProps {
  plant: Plant;
  sensorData: SensorData | null;
  allData?: SensorData[]; // Make it optional
}

const PDFReportGenerator: React.FC<PDFReportGeneratorProps> = ({ 
  plant, 
  sensorData, 
  allData = [] // Provide default empty array
}) => {
  
  const calculateTimeRange = () => {
    if (!allData || allData.length === 0) return null;
    
    const timestamps = allData
      .map(data => data?.timestamp ? new Date(data.timestamp).getTime() : 0)
      .filter(Boolean);
    
    if (timestamps.length === 0) return null;

    const minTime = Math.min(...timestamps);
    const maxTime = Math.max(...timestamps);
    
    return {
      start: new Date(minTime),
      end: new Date(maxTime),
      duration: maxTime - minTime
    };
  };

  const formatDuration = (ms: number) => {
    if (isNaN(ms) || ms <= 0) return "0 seconds";
    
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  };

  // Helper function to calculate min, max, and average
  const getMinMaxAvg = (values: number[]) => {
    if (!values || values.length === 0) return { min: 0, max: 0, avg: 0 };
    const validValues = values.filter(v => typeof v === 'number' && !isNaN(v));
    if (validValues.length === 0) return { min: 0, max: 0, avg: 0 };
    
    const min = Math.min(...validValues);
    const max = Math.max(...validValues);
    const avg = validValues.reduce((sum, val) => sum + val, 0) / validValues.length;
    return { min, max, avg };
  };

  // Helper function to check if value is within optimal range
  const isOptimal = (value: number, range: { min: number; max: number }) => {
    return value >= range.min && value <= range.max;
  };

  const generatePDFContent = () => {
    const timeRange = calculateTimeRange();
    if (!timeRange || !allData || allData.length === 0) return '';

    const reportDate = new Date().toLocaleDateString();
    const reportTime = new Date().toLocaleTimeString();
    const durationString = formatDuration(timeRange.duration);
    
    // Get min/max/avg for each metric
    const metrics = {
      temperature: getMinMaxAvg(allData.map(d => d?.temperature)),
      humidity: getMinMaxAvg(allData.map(d => d?.humidity)),
      moisture: getMinMaxAvg(allData.map(d => d?.moisture)),
      sunlight: getMinMaxAvg(allData.map(d => d?.sunlight)),
      nitrogen: getMinMaxAvg(allData.map(d => d?.nitrogen)),
      phosphorus: getMinMaxAvg(allData.map(d => d?.phosphorus)),
      potassium: getMinMaxAvg(allData.map(d => d?.potassium)),
      waterLevel: getMinMaxAvg(allData.map(d => d?.waterLevel)),
      fertilizerLevel: getMinMaxAvg(allData.map(d => d?.fertilizerLevel)),
    };

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Smart Agriculture Report - ${plant?.name || 'Unknown Plant'}</title>
    <style>
        /* ... (keep your existing styles) ... */
    </style>
</head>
<body>
    <div class="header">
        <h1>🌱 Smart Agriculture Report</h1>
        <p><strong>Plant:</strong> ${plant?.name || 'Unknown Plant'}</p>
        <p><strong>Device:</strong> ${plant?.id === 'level1' ? 'ESP32_1' : 'ESP32_2'}</p>
        <p><strong>Generated:</strong> ${reportDate} at ${reportTime}</p>
        
        <div class="time-range">
            <div class="time-range-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                ${timeRange.start.toLocaleDateString()} to ${timeRange.end.toLocaleDateString()}
            </div>
            <div class="time-range-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                ${timeRange.start.toLocaleTimeString()} - ${timeRange.end.toLocaleTimeString()}
            </div>
        </div>
        <p><strong>Monitoring Duration:</strong> ${durationString}</p>
    </div>

    <!-- ... (rest of your HTML content with proper null checks) ... -->
</body>
</html>
    `;
  };

  const downloadPDF = () => {
    try {
      const timeRange = calculateTimeRange();
      if (!timeRange || !allData || allData.length === 0) {
        alert('No data available to generate report.');
        return;
      }

      const htmlContent = generatePDFContent();
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `smart-agriculture-report-${plant?.name?.toLowerCase()?.replace(/\s+/g, '-') || 'report'}-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    }
  };

  const timeRange = calculateTimeRange();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Data Report
          </h2>
        </div>
        <button
          onClick={downloadPDF}
          disabled={!timeRange}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            timeRange
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transform hover:scale-105'
              : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
        >
          <Download size={16} />
          Download Report
        </button>
      </div>

      {timeRange ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Data Points</h3>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{allData?.length || 0}</p>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-800 dark:text-green-300">Monitoring Period</h3>
            <p className="text-2xl font-bold text-green-900 dark:text-green-100">{timeRange ? formatDuration(timeRange.duration) : '0 seconds'}</p>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-purple-800 dark:text-purple-300">Start Time</h3>
            <p className="text-lg font-bold text-purple-900 dark:text-purple-100">
              {timeRange?.start.toLocaleTimeString() || 'N/A'}
            </p>
            <p className="text-xs text-purple-700 dark:text-purple-300">
              {timeRange?.start.toLocaleDateString() || 'N/A'}
            </p>
          </div>
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-orange-800 dark:text-orange-300">End Time</h3>
            <p className="text-lg font-bold text-orange-900 dark:text-orange-100">
              {timeRange?.end.toLocaleTimeString() || 'N/A'}
            </p>
            <p className="text-xs text-orange-700 dark:text-orange-300">
              {timeRange?.end.toLocaleDateString() || 'N/A'}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No data available yet.</p>
          <p className="text-sm">Data will appear here once sensor readings are collected.</p>
        </div>
      )}
    </div>
  );
};

export default PDFReportGenerator;