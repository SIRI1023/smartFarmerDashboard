import React from 'react';
import { Droplets, Wind, Sun, Gauge, Eye } from 'lucide-react';

interface Props {
  dewPoint: number;
  uvIndex: number;
  pressure: number;
  visibility: number;
}

const WeatherDetails: React.FC<Props> = ({
  dewPoint,
  uvIndex,
  pressure,
  visibility
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Conditions</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
          <Droplets className="h-6 w-6 text-blue-600 mx-auto mb-2" />
          <p className="text-lg font-bold text-blue-900">{dewPoint}°C</p>
          <p className="text-sm text-blue-700">Dew Point</p>
        </div>

        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
          <Sun className="h-6 w-6 text-blue-600 mx-auto mb-2" />
          <p className="text-lg font-bold text-blue-900">{uvIndex}</p>
          <p className="text-sm text-blue-700">UV Index</p>
        </div>

        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
          <Gauge className="h-6 w-6 text-blue-600 mx-auto mb-2" />
          <p className="text-lg font-bold text-blue-900">{pressure} hPa</p>
          <p className="text-sm text-blue-700">Pressure</p>
        </div>

        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
          <Eye className="h-6 w-6 text-blue-600 mx-auto mb-2" />
          <p className="text-lg font-bold text-blue-900">{visibility} km</p>
          <p className="text-sm text-blue-700">Visibility</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherDetails;