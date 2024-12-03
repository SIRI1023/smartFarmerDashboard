import React from 'react';
import { Sprout, Droplets, Wind, AlertTriangle } from 'lucide-react';

interface Props {
  temperature: number;
  windSpeed: number;
  humidity: number;
  description: string;
}

const FarmingRecommendations: React.FC<Props> = ({
  temperature,
  windSpeed,
  humidity,
  description
}) => {
  const generateRecommendations = () => {
    const recommendations = [];

    // Spraying conditions
    if (windSpeed > 15) {
      recommendations.push({
        type: 'spraying',
        message: 'Avoid pesticide spraying due to high winds',
        icon: <Wind className="h-5 w-5 text-orange-600" />
      });
    }

    // Irrigation recommendations
    if (humidity < 30 && temperature > 25) {
      recommendations.push({
        type: 'irrigation',
        message: 'Consider irrigation due to dry conditions',
        icon: <Droplets className="h-5 w-5 text-blue-600" />
      });
    }

    // General farming activities
    if (description.includes('rain')) {
      recommendations.push({
        type: 'activity',
        message: 'Postpone outdoor farming activities',
        icon: <AlertTriangle className="h-5 w-5 text-amber-600" />
      });
    }

    // Plant stress management
    if (temperature > 30) {
      recommendations.push({
        type: 'management',
        message: 'Monitor plants for heat stress; consider shade protection',
        icon: <Sprout className="h-5 w-5 text-green-600" />
      });
    }

    return recommendations;
  };

  const recommendations = generateRecommendations();

  if (recommendations.length === 0) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg shadow-sm border border-green-200">
        <div className="flex items-center space-x-2">
          <Sprout className="h-5 w-5 text-green-600" />
          <p className="text-green-800 font-medium">Weather conditions are favorable for farming activities</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Farming Recommendations</h3>
      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <div 
            key={index} 
            className="flex items-start space-x-3 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-sm border border-gray-200"
          >
            {rec.icon}
            <p className="text-gray-800">{rec.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FarmingRecommendations;