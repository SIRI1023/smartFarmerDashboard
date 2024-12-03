import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import CurrentWeather from '../components/weather/CurrentWeather';
import WeatherForecast from '../components/weather/WeatherForecast';
import LocationSearch from '../components/weather/LocationSearch';
import WeatherAlerts from '../components/weather/WeatherAlerts';
import FarmingRecommendations from '../components/weather/FarmingRecommendations';
import WeatherDetails from '../components/weather/WeatherDetails';
import { getWeatherData, getWeatherForecast, generateFarmingRecommendations } from '../services/weather';
import toast from 'react-hot-toast';

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
  dewPoint: number;
  uvIndex: number;
  precipitation: number;
  pressure: number;
  visibility: number;
}

interface ForecastData {
  date: string;
  temperature: number;
  humidity: number;
  description: string;
  precipitation: number;
  dewPoint: number;
  windSpeed: number;
}

const Weather = () => {
  const [location, setLocation] = useState('Austin');
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  const fetchWeatherData = async (searchLocation: string) => {
    setLoading(true);
    try {
      const weather = await getWeatherData(searchLocation);
      setCurrentWeather(weather);
      setLocation(searchLocation);

      const forecastData = await getWeatherForecast(searchLocation);
      setForecast(forecastData);

      const farmingRecs = generateFarmingRecommendations(weather);
      setRecommendations(farmingRecs);
    } catch (error: any) {
      console.error('Error fetching weather data:', error);
      toast.error(error.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData(location);

    // Auto-refresh weather data every 30 minutes
    const refreshInterval = setInterval(() => {
      fetchWeatherData(location);
    }, 30 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Weather Information</h1>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>

        <LocationSearch 
          onSearch={fetchWeatherData}
          defaultLocation={location}
        />

        {currentWeather && (
          <>
            <WeatherAlerts {...currentWeather} />
            <CurrentWeather 
              data={currentWeather}
              location={location}
            />
            <WeatherDetails
              dewPoint={currentWeather.dewPoint}
              uvIndex={currentWeather.uvIndex}
              pressure={currentWeather.pressure}
              visibility={currentWeather.visibility}
            />
            <FarmingRecommendations 
              {...currentWeather}
              recommendations={recommendations}
            />
          </>
        )}

        {forecast.length > 0 && (
          <WeatherForecast data={forecast} />
        )}
      </div>
    </Layout>
  );
};

export default Weather;