import React from 'react';
import { Cloud, Droplets, Wind, Sun } from 'lucide-react';

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
}

interface Props {
  data: WeatherData;
  location: string;
}

const CurrentWeather: React.FC<Props> = ({ data, location }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Current Weather</h2>
          <p className="text-sm text-gray-500 mt-1">{location}</p>
        </div>
        <Cloud className="text-blue-600 h-8 w-8" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-sm">
          <Sun className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-blue-900">
            {data.temperature}°C
          </p>
          <p className="text-sm text-blue-700">Temperature</p>
        </div>

        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-sm">
          <Droplets className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-blue-900">
            {data.humidity}%
          </p>
          <p className="text-sm text-blue-700">Humidity</p>
        </div>

        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-sm">
          <Wind className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-blue-900">
            {data.windSpeed} km/h
          </p>
          <p className="text-sm text-blue-700">Wind Speed</p>
        </div>

        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-sm">
          <Cloud className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <p className="text-lg font-medium text-blue-900 capitalize">
            {data.description}
          </p>
          <p className="text-sm text-blue-700">Condition</p>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;