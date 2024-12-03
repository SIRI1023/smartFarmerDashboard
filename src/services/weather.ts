import axios from 'axios';
import toast from 'react-hot-toast';

const API_KEY = '5ed28e2fc36137feee1d159ae0e3eb2f';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

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

const calculateDewPoint = (temp: number, humidity: number): number => {
  const a = 17.27;
  const b = 237.7;
  const alpha = ((a * temp) / (b + temp)) + Math.log(humidity / 100);
  return Math.round((b * alpha) / (a - alpha));
};

export const getWeatherData = async (location: string): Promise<WeatherData> => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: location,
        appid: API_KEY,
        units: 'metric'
      }
    });

    const temp = Math.round(response.data.main.temp);
    const humidity = response.data.main.humidity;

    return {
      temperature: temp,
      humidity: humidity,
      windSpeed: Math.round(response.data.wind.speed * 3.6), // Convert m/s to km/h
      description: response.data.weather[0].description,
      dewPoint: calculateDewPoint(temp, humidity),
      uvIndex: response.data.uvi || 0,
      precipitation: response.data.rain?.['1h'] || 0,
      pressure: response.data.main.pressure,
      visibility: Math.round(response.data.visibility / 1000) // Convert m to km
    };
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error('Location not found. Please check the spelling and try again.');
    }
    throw new Error('Failed to fetch weather data. Please try again later.');
  }
};

export const getWeatherForecast = async (location: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: location,
        appid: API_KEY,
        units: 'metric'
      }
    });

    // Process 5-day forecast data
    const dailyForecasts = response.data.list
      .filter((_: any, index: number) => index % 8 === 0) // Get one reading per day
      .slice(0, 5) // Get 5 days of forecast
      .map((item: any) => ({
        date: item.dt_txt,
        temperature: Math.round(item.main.temp),
        humidity: item.main.humidity,
        description: item.weather[0].description,
        precipitation: Math.round(item.pop * 100), // Probability of precipitation
        dewPoint: calculateDewPoint(item.main.temp, item.main.humidity),
        windSpeed: Math.round(item.wind.speed * 3.6)
      }));

    return dailyForecasts;
  } catch (error: any) {
    console.error('Error fetching forecast:', error);
    toast.error('Failed to fetch weather forecast');
    return [];
  }
};

export const generateFarmingRecommendations = (weather: WeatherData): string[] => {
  const recommendations: string[] = [];

  // Temperature-based recommendations
  if (weather.temperature <= 2) {
    recommendations.push("Risk of frost damage. Use frost protection methods and avoid watering in the evening.");
  } else if (weather.temperature >= 35) {
    recommendations.push("High temperature stress likely. Increase irrigation frequency and consider shade protection.");
  }

  // Humidity and disease risk
  if (weather.humidity > 85) {
    recommendations.push("High humidity increases disease risk. Monitor for fungal diseases and ensure good air circulation.");
  } else if (weather.humidity < 30) {
    recommendations.push("Low humidity may cause water stress. Consider irrigation and mulching.");
  }

  // Wind conditions
  if (weather.windSpeed > 30) {
    recommendations.push("Strong winds may damage crops. Secure structures and avoid spraying operations.");
  }

  // Precipitation and irrigation
  if (weather.precipitation > 0) {
    recommendations.push("Rain expected. Adjust irrigation schedules and monitor soil drainage.");
  }

  // UV Index
  if (weather.uvIndex > 8) {
    recommendations.push("High UV levels. Consider protective measures for sensitive crops.");
  }

  // Dew Point considerations
  if (weather.dewPoint < 2) {
    recommendations.push("Low dew point indicates frost risk. Protect sensitive crops overnight.");
  }

  return recommendations;
};