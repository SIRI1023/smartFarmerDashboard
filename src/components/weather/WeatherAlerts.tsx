import React from 'react';
import { AlertTriangle, ThermometerSun, Wind, CloudRain } from 'lucide-react';

interface WeatherAlert {
  type: 'frost' | 'heat' | 'wind' | 'rain';
  message: string;
  severity: 'warning' | 'severe';
}

interface Props {
  temperature: number;
  windSpeed: number;
  humidity: number;
  description: string;
}

const WeatherAlerts: React.FC<Props> = ({ temperature, windSpeed, humidity, description }) => {
  const generateAlerts = (): WeatherAlert[] => {
    const alerts: WeatherAlert[] = [];

    // Frost alert
    if (temperature <= 2) {
      alerts.push({
        type: 'frost',
        message: 'Risk of frost damage to crops. Consider protective measures.',
        severity: temperature <= 0 ? 'severe' : 'warning'
      });
    }

    // Heat stress alert
    if (temperature >= 35) {
      alerts.push({
        type: 'heat',
        message: 'High temperature may cause crop stress. Ensure adequate irrigation.',
        severity: temperature >= 38 ? 'severe' : 'warning'
      });
    }

    // Wind alert
    if (windSpeed >= 30) {
      alerts.push({
        type: 'wind',
        message: 'High winds may affect crops and spraying operations.',
        severity: windSpeed >= 40 ? 'severe' : 'warning'
      });
    }

    // Rain/Storm alert
    if (description.includes('rain') || description.includes('storm')) {
      alerts.push({
        type: 'rain',
        message: 'Precipitation expected. Plan field operations accordingly.',
        severity: description.includes('heavy') ? 'severe' : 'warning'
      });
    }

    return alerts;
  };

  const alerts = generateAlerts();

  if (alerts.length === 0) return null;

  return (
    <div className="mb-6">
      {alerts.map((alert, index) => (
        <div
          key={index}
          className={`mb-2 p-4 rounded-lg flex items-start space-x-3 ${
            alert.severity === 'severe' 
              ? 'bg-red-100 text-red-900 border border-red-200' 
              : 'bg-amber-100 text-amber-900 border border-amber-200'
          }`}
        >
          {alert.type === 'frost' && <ThermometerSun className="h-5 w-5 flex-shrink-0 mt-0.5" />}
          {alert.type === 'heat' && <ThermometerSun className="h-5 w-5 flex-shrink-0 mt-0.5" />}
          {alert.type === 'wind' && <Wind className="h-5 w-5 flex-shrink-0 mt-0.5" />}
          {alert.type === 'rain' && <CloudRain className="h-5 w-5 flex-shrink-0 mt-0.5" />}
          
          <div>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-semibold">
                {alert.severity === 'severe' ? 'Severe Warning' : 'Weather Alert'}
              </span>
            </div>
            <p className="mt-1 text-sm">{alert.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WeatherAlerts;