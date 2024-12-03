import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Cloud, Droplets, Wind, Sprout, Search } from 'lucide-react';
import ImageUpload from '../components/crops/ImageUpload';
import AnalysisResult from '../components/crops/AnalysisResult';
import AnalysisModal from '../components/crops/AnalysisModal';
import { analyzeCropImage } from '../services/cropAnalysis';
import { getWeatherData } from '../services/weather';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
}

interface Analysis {
  disease: string;
  confidence: number;
  recommendation: string;
  imageUrl: string;
  crop_name?: string;
}

const Dashboard = () => {
  const [weatherData, setWeatherData] = useState<WeatherData>({
    temperature: 0,
    humidity: 0,
    windSpeed: 0,
    description: ''
  });
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [recentAnalyses, setRecentAnalyses] = useState<any[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<any>(null);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error('User not authenticated');
        }

        // Fetch weather data
        try {
          const weather = await getWeatherData('Austin');
          setWeatherData(weather);
        } catch (weatherError) {
          console.error('Weather fetch error:', weatherError);
          toast.error('Failed to load weather data');
        }

        // Fetch recent analyses for current user
        try {
          const { data, error } = await supabase
            .from('crops')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(3);

          if (error) throw error;
          
          if (data) {
            setRecentAnalyses(data);
          }
        } catch (analysisError) {
          console.error('Analysis fetch error:', analysisError);
          toast.error('Failed to load recent analyses');
        }
      } catch (error: any) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpload = async (file: File) => {
    setLoading(true);
    try {
      const result = await analyzeCropImage(file);
      setAnalysis(result);
      
      // Refresh recent analyses after new upload
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('crops')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) throw error;
        
        if (data) {
          setRecentAnalyses(data);
        }
      }
      
      toast.success('Analysis complete!');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to analyze image');
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Crop Analysis</h2>
              <ImageUpload onUpload={handleUpload} loading={loading} />
              {analysis && <AnalysisResult {...analysis} />}
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Recent Analyses</h2>
                <Sprout className="text-green-500" />
              </div>
              <div className="space-y-4">
                {recentAnalyses.length > 0 ? (
                  recentAnalyses.map((analysis) => (
                    <button
                      key={analysis.id}
                      className="w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left group"
                      onClick={() => setSelectedAnalysis(analysis)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900 group-hover:text-green-600">
                            {analysis.disease_detected || 'Unknown Disease'}
                          </p>
                          <p className="text-sm text-gray-500">
                            Confidence: {(analysis.confidence * 100).toFixed(1)}%
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            {new Date(analysis.created_at).toLocaleDateString()}
                          </span>
                          <Search className="w-4 h-4 text-gray-400 group-hover:text-green-500" />
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500">No analyses yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Weather Information</h2>
                <Cloud className="text-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Droplets className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-700">
                    {weatherData.temperature}°C
                  </p>
                  <p className="text-sm text-blue-600">Temperature</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Wind className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-700">
                    {weatherData.windSpeed} km/h
                  </p>
                  <p className="text-sm text-blue-600">Wind Speed</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Cloud className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-700">
                    {weatherData.humidity}%
                  </p>
                  <p className="text-sm text-blue-600">Humidity</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-lg font-medium text-blue-700 capitalize">
                    {weatherData.description}
                  </p>
                  <p className="text-sm text-blue-600">Condition</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {selectedAnalysis && (
          <AnalysisModal
            analysis={selectedAnalysis}
            onClose={() => setSelectedAnalysis(null)}
          />
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;