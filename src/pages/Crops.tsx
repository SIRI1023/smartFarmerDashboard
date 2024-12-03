import React, { useState } from 'react';
import Layout from '../components/Layout';
import ImageUpload from '../components/crops/ImageUpload';
import { AlertTriangle } from 'lucide-react';
import { analyzeCropImage } from '../services/cropAnalysis';
import toast from 'react-hot-toast';
import type { Database } from '../lib/supabase';

interface Prediction {
  disease_name: string;
  confidence: number;
  recommendation: string;
  imageUrl: string;
}

const Crops: React.FC = () => {
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (file: File) => {
    setLoading(true);
    try {
      const result = await analyzeCropImage(file);
      setPrediction(result);
      toast.success('Analysis completed successfully!');
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Crop Disease Detection</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <ImageUpload onUpload={handleUpload} loading={loading} />
          </div>

          {prediction && !loading && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Results</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Disease Detected</p>
                  <p className="text-lg font-medium">{prediction.disease_name || 'No disease detected'}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Confidence</p>
                  <p className="text-lg font-medium">
                    {prediction.confidence ? `${(prediction.confidence * 100).toFixed(1)}%` : 'N/A'}
                  </p>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Recommended Action</p>
                      <p className="mt-1 text-sm text-gray-500">
                        {prediction.recommendation || 'No specific recommendations available'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <img 
                    src={prediction.imageUrl} 
                    alt="Analyzed crop" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Crops;