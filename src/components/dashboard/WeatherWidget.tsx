import React from 'react';
import { Cloud, Droplets, Wind } from 'lucide-react';

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
}

const WeatherWidget: React.FC<{ data: WeatherData }> = ({ data }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Weather</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-3">
          <Cloud className="text-blue-500" />
          <div>
            <p className="text-sm text-gray-500">Temperature</p>
            <p className="text-lg font-medium">{data.temperature}°C</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Droplets className="text-blue-500" />
          <div>
            <p className="text-sm text-gray-500">Humidity</p>
            <p className="text-lg font-medium">{data.humidity}%</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Wind className="text-blue-500" />
          <div>
            <p className="text-sm text-gray-500">Wind Speed</p>
            <p className="text-lg font-medium">{data.windSpeed} km/h</p>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500">Condition</p>
          <p className="text-lg font-medium capitalize">{data.description}</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;