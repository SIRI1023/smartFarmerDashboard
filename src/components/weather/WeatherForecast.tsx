import React from 'react';
import { Cloud, Sun, CloudRain } from 'lucide-react';

interface ForecastData {
  date: string;
  temperature: number;
  humidity: number;
  description: string;
  precipitation: number;
}

interface Props {
  data: ForecastData[];
}

const WeatherForecast: React.FC<Props> = ({ data }) => {
  const getWeatherIcon = (description: string) => {
    if (description.includes('rain')) return <CloudRain className="h-6 w-6 text-blue-600" />;
    if (description.includes('cloud')) return <Cloud className="h-6 w-6 text-blue-600" />;
    return <Sun className="h-6 w-6 text-blue-600" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">5-Day Forecast</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {data.map((day, index) => (
          <div 
            key={index} 
            className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 shadow-sm border border-blue-200"
          >
            <div className="text-center">
              <p className="text-sm font-medium text-blue-800">
                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
              </p>
              <div className="my-2">
                {getWeatherIcon(day.description)}
              </div>
              <p className="text-xl font-bold text-blue-900">{day.temperature}°C</p>
              <div className="mt-2 text-sm text-blue-800">
                <p>Humidity: {day.humidity}%</p>
                <p>Rain: {day.precipitation}%</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherForecast;